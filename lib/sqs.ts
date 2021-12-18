import sqs = require('@aws-cdk/aws-sqs');
import iam = require('@aws-cdk/aws-iam');
import {Stack} from "@aws-cdk/core";

export function mySqs(stack: Stack, ecsTaskRole: iam.Role, lambdaRole: iam.Role): sqs.Queue {
    const mySqs = new sqs.Queue(stack, 'btp-transactions-queue-id', {
        queueName: 'btp-transactions-queue'
    });
    mySqs.grantSendMessages(ecsTaskRole);
    mySqs.grantConsumeMessages(lambdaRole);
    return mySqs;
}