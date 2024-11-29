import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as NewsFeedApi from '../lib/news-feed-api-stack';

describe('NewsFeedApiStack', () => {
  test('creates all resources', () => {
    const app = new cdk.App();
    const stack = new NewsFeedApi.NewsFeedApiStack(app, 'MyTestStack', {
      env:{
        account: '123456789012',
        region: 'us-east-1'
      }
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Cognito::UserPool', {});
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {});
    template.hasResourceProperties('AWS::Cognito::UserPoolDomain', {});
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {});
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {});
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {});
    template.hasResourceProperties('AWS::EC2::LaunchTemplate', {});
    template.hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {});
    const securityGroups = template.findResources('AWS::EC2::SecurityGroup');
    expect(Object.keys(securityGroups).length).toBe(2);

  });
});
