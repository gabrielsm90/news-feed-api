import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface SecurityGroupConstructProps {
  vpc: ec2.IVpc;
}

export class SecurityGroupConstruct extends Construct {
  
  public readonly loadBalancerSecurityGroup: cdk.aws_ec2.SecurityGroup;
  public readonly instanceSecurityGroup: cdk.aws_ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityGroupConstructProps) {
    super(scope, id);  

    // Security Group for the Load Balancers, where traffic from API Gateway is allowed only
    this.loadBalancerSecurityGroup = new ec2.SecurityGroup(this, 'NewsFeedApiALBSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'NewsFeedApiALBSecurityGroup',
      allowAllOutbound: true,
    });
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.220.28.0/22'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.216.144.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.212.178.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.218.96.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.216.136.0/21'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.216.148.0/22'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.212.180.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.206.4.0/22'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.235.32.0/21'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.216.135.0/24'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.210.64.0/22'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.212.176.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.235.26.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('44.212.182.0/23'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.238.212.0/22'), ec2.Port.tcp(80));
    this.loadBalancerSecurityGroup.addIngressRule(ec2.Peer.ipv4('3.238.166.0/24'), ec2.Port.tcp(80));
    
    // Security Group for the instances
    this.instanceSecurityGroup = new ec2.SecurityGroup(this, 'NewsFeedApiInstanceSecurityGroup', {
      vpc: props.vpc,
      securityGroupName: 'NewsFeedApiInstanceSecurityGroup',
      allowAllOutbound: true,
    });
    this.instanceSecurityGroup.addIngressRule(this.loadBalancerSecurityGroup, ec2.Port.tcp(80));
  }
}
