#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NewsFeedApiStack } from '../lib/news-feed-api-stack';

const app = new cdk.App();
new NewsFeedApiStack(app, 'NewsFeedApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});