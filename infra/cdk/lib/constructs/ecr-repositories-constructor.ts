import * as ecr from 'aws-cdk-lib/aws-ecr';
import {Construct} from "constructs";

export class EcrConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    try {
      ecr.Repository.fromRepositoryName(this, 'SearchServiceRepository', 'search-service');
    } catch (error) {
      new ecr.Repository(this, 'SearchServiceRepository', {
        repositoryName: 'search-service'
      });
    }
  }
}