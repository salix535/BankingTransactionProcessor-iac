import cf = require('@aws-cdk/aws-cloudfront');
import {Stack} from "@aws-cdk/core";
import {Bucket} from "@aws-cdk/aws-s3";
import {OriginProtocolPolicy} from "@aws-cdk/aws-cloudfront";

export function createCloudFront(stack: Stack, sourceBucket: Bucket): cf.CloudFrontWebDistribution {
    return new cf.CloudFrontWebDistribution(stack, 'BtpFrontDistribution', {
        originConfigs: [
            {
                customOriginSource: {
                    domainName: sourceBucket.bucketWebsiteDomainName,
                    originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
                },
                behaviors : [{isDefaultBehavior: true},],
            },
        ],
    });
}