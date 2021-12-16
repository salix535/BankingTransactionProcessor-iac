import iam = require('@aws-cdk/aws-iam');
import {Stack} from "@aws-cdk/core";

export function myIamRoles(stack: Stack): iam.Role {

    const taskRole = new iam.Role(stack, 'btp-task-role', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        roleName: 'Btp-ecs-task-role'
    });

    return taskRole;
}