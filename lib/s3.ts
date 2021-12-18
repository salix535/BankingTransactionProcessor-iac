import {RemovalPolicy, Stack} from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import s3Deployment = require("@aws-cdk/aws-s3-deployment");

export function createFrontendBucket(stack: Stack): s3.Bucket {
    const websiteBucket = new s3.Bucket(stack, 'btp-frontend-bucket', {
        websiteIndexDocument: 'index.html',
        publicReadAccess: true,
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY
    });

    new s3Deployment.BucketDeployment(stack, 'DeployWebsite', {
        sources: [s3Deployment.Source.asset('lib/website')],
        destinationBucket: websiteBucket,
        retainOnDelete: false
    });

    return websiteBucket;
}