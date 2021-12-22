import {RemovalPolicy, Stack} from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");

export function createFrontendBucket(stack: Stack): s3.Bucket {
    return  new s3.Bucket(stack, 'btp-frontend-bucket', {
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html',
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY
    });
}