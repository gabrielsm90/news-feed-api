import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { APIGatewayConstruct } from '../../lib/constructs/api-gateway-constructor'
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { SearchServiceConstruct } from '../../lib/constructs/search-service-constructor';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

describe('SearchServiceConstruct', () => {
  let template: Template;

  beforeEach(() => {
    const stack = new cdk.Stack(new cdk.App(), 'TestStack');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    new SearchServiceConstruct(stack, 'SearchServiceConstruct', {
      vpc,
      loadBalancerSecurityGroup: new ec2.SecurityGroup(stack, 'LoadBalancerSecurityGroup', {
        vpc,
        securityGroupName: 'LoadBalancerSecurityGroup',
      }),
      instanceSecurityGroup: new ec2.SecurityGroup(stack, 'InstanceSecurityGroup', {
        vpc,
        securityGroupName: 'InstanceSecurityGroup',
      }),
    });
    new APIGatewayConstruct(stack, 'APIGatewayConstruct', {
      userPool: new cognito.UserPool(stack, 'UserPool'),
      searchServiceLoadBalancerDnsName: 'example.com',
    });
    template = Template.fromStack(stack);
  });

  test('should create a Load Balancer', () => {
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'application',
      SecurityGroups: [
        {
          'Fn::GetAtt': [
            'LoadBalancerSecurityGroup3036A0FC',
            'GroupId',
          ],
        },
      ],
    });
  });

  test('should create a Target Group', () => {
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 80,
      Protocol: 'HTTP',
      TargetType: 'instance',
    });
  });

  test('should create a Launch Template', () => {
    template.hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateName: 'NewsFeedApiSearchServiceLaunchTemplate',
    });
  });

  test('should create an Auto Scaling Group', () => {
    template.hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '1',
      MaxSize: '1',
    });
  });
});
