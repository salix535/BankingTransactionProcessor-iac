import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {aws_ecs_patterns, Stack} from "aws-cdk-lib";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import ecs = require('aws-cdk-lib/aws-ecs');
import iam = require('aws-cdk-lib/aws-iam');
import * as path from "path";

export function myEcs(stack: Stack, taskRole: iam.Role, sqsUrl: string, userPoolId: string): ApplicationLoadBalancedFargateService {

    const vpc = new Vpc(stack, 'BtpVpc', {
        maxAzs: 2
    });
    const cluster = new ecs.Cluster(stack, 'BtpClusterId', {vpc, clusterName: 'BtpCluster'});

    const logging = new ecs.AwsLogDriver({
        streamPrefix: 'btp'
    });

    const loadBalancedService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(stack, 'BtpFargateService', {
        cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        taskImageOptions: {
            environment: {
                SQS_URL: sqsUrl,
                USER_POOL_ID: userPoolId
            },
            taskRole: taskRole,
            containerPort: 8080,
            logDriver: logging,
            image: ecs.ContainerImage.fromAsset(path.resolve('/Users/aleksandarhavran/workplace/BankingTransactionProcessor'))
        }
    });

    loadBalancedService.targetGroup.configureHealthCheck({
        path: '/actuator/health'
    });

    return loadBalancedService;
}