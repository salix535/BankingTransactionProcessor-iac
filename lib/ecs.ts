import {RemovalPolicy, Stack} from "@aws-cdk/core";
import {ApplicationLoadBalancedFargateService} from "@aws-cdk/aws-ecs-patterns";
import {Vpc} from "@aws-cdk/aws-ec2";
import * as path from "path";
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');

export function myEcs(stack: Stack, taskRole: iam.Role, sqsUrl: string, userPoolId: string): ApplicationLoadBalancedFargateService {

    const vpc = new Vpc(stack, 'BtpVpc', {
        maxAzs: 2
    });
    const cluster = new ecs.Cluster(stack, 'BtpClusterId', {vpc, clusterName: 'BtpCluster'});

    const logging = new ecs.AwsLogDriver({
        streamPrefix: 'btp'
    });

    logging.logGroup?.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const loadBalancedService = new ApplicationLoadBalancedFargateService(stack, 'BtpFargateService', {
        cluster,
        cpu: 256,
        publicLoadBalancer: false,
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