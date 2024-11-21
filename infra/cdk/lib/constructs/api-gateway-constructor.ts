import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface APIGatewayConstructProps {
  userPool: cognito.UserPool;
  searchServiceLoadBalancerDnsName: string;
}

export class APIGatewayConstruct extends Construct {

  constructor(scope: Construct, id: string, props: APIGatewayConstructProps) {
    super(scope, id);
    
    // Creation
    const api = new apigateway.RestApi(this, 'NewsFeedApiGateway', {
      restApiName: 'NewsFeedApiGateway',
    });

    // Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'NewsFeedApiAuthorizer', {
      cognitoUserPools: [props.userPool],
      authorizerName: 'NewsFeedApiAuthorizer',
      resultsCacheTtl: cdk.Duration.minutes(5),
      identitySource: 'method.request.header.Authorization',
    });

    // Resources for the Search Service
    // /results
    const resultsResource = api.root.addResource('results');

    // GET /results
    resultsResource.addMethod('GET', new apigateway.Integration({
      type: apigateway.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'GET',
      uri: `http://${props.searchServiceLoadBalancerDnsName}`}), 
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {},
          },
        ],
      }
    );

  }
}
