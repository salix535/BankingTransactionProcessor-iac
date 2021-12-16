import { Stack, StackProps } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import {myUserPool} from "./cognito";
import {myEcs} from "./ecs";
import {myIamRoles} from "./iam-roles";
import {mySqs} from "./sqs";
import {createApiGateway} from "./api-gateway";
import {createDynamoTable} from "./dynamo";

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const taskRole = myIamRoles(this);

    const sqs = mySqs(this, taskRole);

    const userPool = myUserPool(this);

    const dynamo = createDynamoTable(this, taskRole);

    const ecs = myEcs(this, taskRole, sqs.queueUrl, userPool.pool.userPoolId);

    createApiGateway(this, userPool.pool, userPool.client, ecs.listener);

  }
}
