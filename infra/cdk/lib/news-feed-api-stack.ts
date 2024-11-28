import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { UserIdentityConstruct } from './constructs/user-identity-construct';
import { SecurityGroupConstruct } from './constructs/security-groups-construct';
import { APIGatewayConstruct } from './constructs/api-gateway-constructor';
import { SearchServiceConstruct } from './constructs/search-service-constructor';
import { EcrConstruct } from "./constructs/ecr-repositories-constructor";


export class NewsFeedApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EcrConstruct(this, 'ECR');

    const vpc = new ec2.Vpc(this, 'NewsFeedApiVpc', { maxAzs: 2 });

    const userIdentityConstruct = new UserIdentityConstruct(this, 'NewsFeedApiUserIdentityStack');
    
    const securityGroupsConstruct = new SecurityGroupConstruct(this, 'NewsFeedApiSecurityGroupStack', {
      vpc,
    });

    const search_service = new SearchServiceConstruct(this, 'NewsFeedApiSearchService', {
      vpc: vpc,
      loadBalancerSecurityGroup: securityGroupsConstruct.loadBalancerSecurityGroup,
      instanceSecurityGroup: securityGroupsConstruct.instanceSecurityGroup,
    });

    new APIGatewayConstruct(this, 'NewsFeedApiGateway', {
      userPool: userIdentityConstruct.userPool,
      searchServiceLoadBalancerDnsName: search_service.loadBalancerDnsName,
    });

  }
}
