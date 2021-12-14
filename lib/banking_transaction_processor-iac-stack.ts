import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {myUserPool} from "./cognito-constructs";
import {myEcs} from "./ecs-constricts";
import {myIamRoles} from "./iam-roles";
import {mySqs} from "./sqs-construct";

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const taskRole = myIamRoles(this);

    const sqs = mySqs(this, taskRole);

    const userPool = myUserPool(this);

    myEcs(this, taskRole, sqs.queueUrl, userPool.userPoolId);
  }
}
