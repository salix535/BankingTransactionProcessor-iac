import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {myUserPool} from "./cognito-constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BankingTransactionProcessorIacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    myUserPool(this);
  }
}
