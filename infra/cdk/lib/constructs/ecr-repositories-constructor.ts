import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import {Construct} from "constructs";

export class EcrConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new ecr.Repository(this, 'SearchServiceRepository', {
      repositoryName: 'search-service'
    });
  }
}