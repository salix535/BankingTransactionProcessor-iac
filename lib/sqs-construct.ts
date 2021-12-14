import sqs = require('aws-cdk-lib/aws-sqs');
import iam = require('aws-cdk-lib/aws-iam');
import {Stack} from "aws-cdk-lib";

export function mySqs(stack: Stack, role: iam.Role): sqs.Queue {
    const mySqs = new sqs.Queue(stack, 'btp-transactions-queue-id', {
        queueName: 'btp-transactions-queue'
    });
    mySqs.grantSendMessages(role);
    return mySqs;
}