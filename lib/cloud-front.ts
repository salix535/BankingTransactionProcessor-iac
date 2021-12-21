import cf = require('@aws-cdk/aws-cloudfront');
import {Stack} from "@aws-cdk/core";
import {Bucket} from "@aws-cdk/aws-s3";

export function createCloudFront(stack: Stack, sourceBucket: Bucket): cf.CloudFrontWebDistribution {
    return  new cf.CloudFrontWebDistribution(stack, 'BtpFrontDistribution', {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: sourceBucket,
                },
                behaviors : [ {isDefaultBehavior: true}],
            },
        ],
    });
}