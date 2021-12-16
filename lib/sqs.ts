import sqs = require('@aws-cdk/aws-sqs');
import iam = require('@aws-cdk/aws-iam');
import {Stack} from "@aws-cdk/core";

export function mySqs(stack: Stack, role: iam.Role): sqs.Queue {
    const mySqs = new sqs.Queue(stack, 'btp-transactions-queue-id', {
        queueName: 'btp-transactions-queue'
    });
    mySqs.grantSendMessages(role);
    return mySqs;
}