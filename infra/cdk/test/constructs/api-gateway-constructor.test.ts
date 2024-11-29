import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { APIGatewayConstruct } from '../../lib/constructs/api-gateway-constructor'
import * as cognito from 'aws-cdk-lib/aws-cognito';

describe('APIGatewayConstruct', () => {
  let template: Template;

  beforeEach(() => {
    const stack = new cdk.Stack(new cdk.App(), 'TestStack');
    const userPool = new cognito.UserPool(stack, 'UserPool');
    const searchServiceLoadBalancerDnsName = 'example.com';

    new APIGatewayConstruct(stack, 'APIGatewayConstruct', {
      userPool,
      searchServiceLoadBalancerDnsName,
    });

    template = Template.fromStack(stack);
  });

  test('should create an API Gateway', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'NewsFeedApiGateway',
    });
  });

  test('should create a Cognito Authorizer', () => {
    template.hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Name: 'NewsFeedApiAuthorizer',
      IdentitySource: 'method.request.header.Authorization',
      Type: 'COGNITO_USER_POOLS',
    });
  });

  test('should create a GET /health endpoint', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        Uri: 'http://example.com/health',
      },
      ResourceId: {
        Ref: Match.stringLikeRegexp('^APIGatewayConstructNewsFeedApiGatewayhealth*')
      },
      AuthorizerId: {
        Ref: Match.stringLikeRegexp('^APIGatewayConstructNewsFeedApiAuthorizer*')
      },
    });
  });

  test('should create a GET /results endpoint', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      Integration: {
        Type: 'HTTP_PROXY',
        IntegrationHttpMethod: 'GET',
        Uri: 'http://example.com/results',
      },
      ResourceId: {
        Ref: Match.stringLikeRegexp('^APIGatewayConstructNewsFeedApiGatewayresults*')
      },
      AuthorizerId: {
        Ref: Match.stringLikeRegexp('^APIGatewayConstructNewsFeedApiAuthorizer*')
      },
    });
  });

});