import { Stack, StackProps } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import {myUserPool} from "./cognito";
import {myEcs} from "./ecs";
import {createEcsTaskRole, createLambdaRole} from "./iam-roles";
import {mySqs} from "./sqs";
import {createApiGateway} from "./api-gateway";
import {createDynamoTable} from "./dynamo";
import {createLambda} from "./lambda";

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ecsTaskRole = createEcsTaskRole(this);
    const lambdaRole = createLambdaRole(this);

    const sqs = mySqs(this, ecsTaskRole, lambdaRole);

    const userPool = myUserPool(this);

    const dynamo = createDynamoTable(this, ecsTaskRole, lambdaRole);

    const lambda = createLambda(this, sqs, lambdaRole);

    const ecs = myEcs(this, ecsTaskRole, sqs.queueUrl, userPool.pool.userPoolId);

    createApiGateway(this, userPool.pool, userPool.client, ecs.listener);

  }
}
