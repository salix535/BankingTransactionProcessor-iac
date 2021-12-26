import { Stack, StackProps } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import {myUserPool} from "./cognito";
import {createEcs} from "./ecs";
import {createEcsTaskRole, createLambdaRole} from "./iam-roles";
import {mySqs} from "./sqs";
import {createApiGateway} from "./api-gateway";
import {createDynamoTable} from "./dynamo";
import {createLambda} from "./lambda";
import {createFrontendBucket} from "./s3";
import {createCloudFront} from "./cloud-front";

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ecsTaskRole = createEcsTaskRole(this);
    const lambdaRole = createLambdaRole(this);

    const sqs = mySqs(this, ecsTaskRole, lambdaRole);

    const frontendBucket = createFrontendBucket(this);

    const cloudFront = createCloudFront(this, frontendBucket);

    const userPool = myUserPool(this, cloudFront);

    createDynamoTable(this, ecsTaskRole, lambdaRole);

    createLambda(this, sqs, lambdaRole);

    const ecs = createEcs(this, ecsTaskRole, sqs.queueUrl, userPool.pool.userPoolId, cloudFront.distributionDomainName);

    createApiGateway(this, userPool.pool, userPool.client, ecs.listener, cloudFront.distributionDomainName);
  }
}
