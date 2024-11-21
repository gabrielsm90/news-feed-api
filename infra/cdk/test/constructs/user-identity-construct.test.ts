import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { UserIdentityConstruct } from '../../lib/constructs/user-identity-construct';

describe('UserIdentityConstruct', () => {
  let template: Template;

  beforeEach(() => {
    const stack = new cdk.Stack(new cdk.App(), 'TestStack');
    new UserIdentityConstruct(stack, 'UserIdentityConstruct');
    template = Template.fromStack(stack);
  });

  test('should create a Cognito User Pool', () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'NewsFeedApiUserPool',
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      Schema: [
        {
          Name: 'email',
          Required: true,
          Mutable: false
        }
      ]
    });
  });

  test('should create an App Client for the user pool', () => {
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'NewsFeedApiUserPoolClient',
      GenerateSecret: false,
      UserPoolId: {
        Ref: Match.stringLikeRegexp('^UserIdentityConstructNewsFeedApiUserPool*')
      },
      SupportedIdentityProviders: ['COGNITO'],
      AllowedOAuthFlows: ['code'],
      AllowedOAuthScopes: ['openid'],
      CallbackURLs: ['https://www.google.com']
    });
  });

  test('should create a User Pool Domain', () => {
    template.hasResourceProperties('AWS::Cognito::UserPoolDomain', {
      Domain: 'news-feed',
      UserPoolId: {
        Ref: Match.stringLikeRegexp('^UserIdentityConstructNewsFeedApiUserPool*')
      }
    });
  });
});