import iam = require('aws-cdk-lib/aws-iam');
import {Stack} from "aws-cdk-lib";

export function myIamRoles(stack: Stack): iam.Role {

    const taskRole = new iam.Role(stack, 'btp-task-role', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        roleName: 'Btp-ecs-task-role'
    });

    return taskRole;
}