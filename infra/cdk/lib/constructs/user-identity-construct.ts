import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';


export class UserIdentityConstruct extends Construct {

  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);       
    
    // User Pool
    this.userPool = new cognito.UserPool(this, 'NewsFeedApiUserPool', {
      userPoolName: 'NewsFeedApiUserPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: { email: { required: true, mutable: false } }
    });

    // App Client
    new cognito.UserPoolClient(this, 'NewsFeedApiUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'NewsFeedApiUserPoolClient',
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: ['https://www.google.com'],
      },
    });

    // User Pool Domain
    new cognito.UserPoolDomain(this, 'NewsFeedApiUserPoolDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: 'news-feed',
      },
    });
  }
}
