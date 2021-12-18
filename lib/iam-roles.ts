import iam = require('@aws-cdk/aws-iam');
import {Stack} from "@aws-cdk/core";

export function createEcsTaskRole(stack: Stack): iam.Role {
    return new iam.Role(stack, 'btp-task-role', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        roleName: 'Btp-ecs-task-role'
    });
}

export function createLambdaRole(stack: Stack): iam.Role {
    return new iam.Role(stack, 'btp-lambda-role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        roleName: 'Btp-lambda-role',
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")]
    });
}