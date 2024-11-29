import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as iam from 'aws-cdk-lib/aws-iam';

interface SearchServiceConstructProps {
  vpc: ec2.IVpc;
  loadBalancerSecurityGroup: ec2.ISecurityGroup;
  instanceSecurityGroup: ec2.ISecurityGroup;
  account_id: string | undefined;
}

export class SearchServiceConstruct extends Construct {

  public readonly loadBalancerDnsName: string;

  constructor(scope: Construct, id: string, props: SearchServiceConstructProps) {
    super(scope, id);
    
    // Create an Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'NewsFeedApiSearchServiceALB', {
      vpc: props.vpc,
      loadBalancerName: 'NewsFeedApiSearchServiceALB',
      internetFacing: true,
      securityGroup: props.loadBalancerSecurityGroup
    });
    this.loadBalancerDnsName = alb.loadBalancerDnsName;

    // Create a Target Group
    const searchServiceTargetGroup = new elbv2.ApplicationTargetGroup(this, 'NewsFeedApiSearchServiceTG', {
      vpc: props.vpc,
      targetGroupName: 'NewsFeedApiSearchServiceTG',
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.INSTANCE,
      healthCheck: {
        enabled: true,
        path: "/health",
        interval: cdk.Duration.seconds(45),
        timeout: cdk.Duration.seconds(15),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 5,
      },
    });

    // Attach a listener to the Load Balancer
    alb.addListener('NewsFeedApiSearchServiceLoadBalancerListener', {
      port: 80,
      open: false
    }).addTargetGroups('NewsFeedApiSearchServiceLoadBalancerTargetGroupAttach', {
      targetGroups: [searchServiceTargetGroup],
    });

    const instanceRole = new iam.Role(this, 'PullImageFromECR', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
      ],
    });

    // Create a Launch Template
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo yum update -y',
      'sudo yum install docker -y',
      'sudo systemctl start docker',
      'sudo systemctl enable docker',
      `sudo aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin ${props.account_id}.dkr.ecr.us-east-1.amazonaws.com`,
      `sudo docker run -d -p 80:8000 ${props.account_id}.dkr.ecr.us-east-1.amazonaws.com/search-service:latest`,
    );
    const launchTemplate = new ec2.LaunchTemplate(this, 'NewsFeedApiSearchServiceLaunchTemplate', {
      launchTemplateName: "NewsFeedApiSearchServiceLaunchTemplate",
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup: props.instanceSecurityGroup,
      userData,
      role: instanceRole,
    });

    // Create an Auto Scaling Group for the Search Service instances
    new autoscaling.AutoScalingGroup(this, 'NewsFeedApiSearchServiceAutoScalingGroup', {
      vpc: props.vpc,
      autoScalingGroupName: 'NewsFeedApiSearchServiceAutoScalingGroup',
      launchTemplate,
      minCapacity: 1,
      maxCapacity: 1,
    }).attachToApplicationTargetGroup(searchServiceTargetGroup);
  }
}
