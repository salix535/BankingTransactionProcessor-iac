import lambda = require('@aws-cdk/aws-lambda-python');
import lambda_event_source = require('@aws-cdk/aws-lambda-event-sources');
import {Stack} from "@aws-cdk/core";
import {Queue} from "@aws-cdk/aws-sqs";
import {Role} from "@aws-cdk/aws-iam";
import {Runtime, Architecture} from "@aws-cdk/aws-lambda";

export function createLambda(stack: Stack, queue: Queue, lambdaRole: Role): lambda.PythonFunction {
    const eventSource = new lambda_event_source.SqsEventSource(queue);

    const btpLambda = new lambda.PythonFunction(stack, 'btp-function', {
        role: lambdaRole,
        entry: 'lib/lambda',
        runtime: Runtime.PYTHON_3_9,
        architecture: Architecture.X86_64
    });

    btpLambda.addEventSource(eventSource);

    return btpLambda;
}