import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SecurityGroupConstruct } from '../../lib/constructs/security-groups-construct';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


describe('SecurityGroupConstruct', () => {
  let template: Template;

  beforeEach(() => {
    const stack = new cdk.Stack(new cdk.App(), 'TestStack');
    new SecurityGroupConstruct(stack, 'UserIdentityConstruct', {
      vpc: new ec2.Vpc(stack, 'NewsFeedApiVpc', { maxAzs: 2 })
    })
    template = Template.fromStack(stack);
  });

  test('should create a Security Group for the Load Balancers', () => {
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupName: 'NewsFeedApiALBSecurityGroup',
    });
  });

  test('should create a Security Group for the instances', () => {
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupName: 'NewsFeedApiInstanceSecurityGroup',
    });
  });
});