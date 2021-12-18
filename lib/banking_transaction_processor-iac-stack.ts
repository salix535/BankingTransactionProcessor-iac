import { Stack, StackProps } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import {myUserPool} from "./cognito";
import {myEcs} from "./ecs";
import {createEcsTaskRole, createLambdaRole} from "./iam-roles";
import {mySqs} from "./sqs";
import {configureApiGateway, configureApiGatewayFront, createBaseApyGateway} from "./api-gateway";
import {createDynamoTable} from "./dynamo";
import {createLambda} from "./lambda";
import {createFrontendBucket} from "./s3";

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ecsTaskRole = createEcsTaskRole(this);
    const lambdaRole = createLambdaRole(this);

    const apiGateway = createBaseApyGateway(this);

    const sqs = mySqs(this, ecsTaskRole, lambdaRole);

    const frontendBucket = createFrontendBucket(this);

    const userPool = myUserPool(this, apiGateway);

    configureApiGatewayFront(apiGateway, frontendBucket);

    const dynamo = createDynamoTable(this, ecsTaskRole, lambdaRole);

    const lambda = createLambda(this, sqs, lambdaRole);

    const ecs = myEcs(this, ecsTaskRole, sqs.queueUrl, userPool.pool.userPoolId);

    configureApiGateway(apiGateway, userPool.pool, userPool.client, ecs.listener);
  }
}
