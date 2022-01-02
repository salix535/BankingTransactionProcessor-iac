import api = require('@aws-cdk/aws-apigatewayv2');
import cognito = require('@aws-cdk/aws-cognito');
import integration = require('@aws-cdk/aws-apigatewayv2-integrations');
import authorizers = require('@aws-cdk/aws-apigatewayv2-authorizers');
import {Stack} from "@aws-cdk/core";
import {ApplicationListener} from "@aws-cdk/aws-elasticloadbalancingv2";

export function createApiGateway(stack: Stack, userPool: cognito.UserPool, client: cognito.UserPoolClient,
    listener: ApplicationListener, cloudFrontDomainName: string): api.HttpApi {
    const apiGateway = new api.HttpApi(stack, 'transactions-api', {
        corsPreflight: {
            allowOrigins: [`https://${cloudFrontDomainName}/`],
            allowHeaders: ['*'],
            allowCredentials: true,
            exposeHeaders: ['*'],
            allowMethods: [api.CorsHttpMethod.ANY]
        }
    });
    const albIntegration = new integration.HttpAlbIntegration('alb-integration-id', listener);

    const authorizer = new authorizers.HttpUserPoolAuthorizer( 'btp-user-pool-authorizer',userPool,{
        userPoolClients: [client]
    });

    apiGateway.addRoutes({
        path: '/transactions',
        methods: [api.HttpMethod.GET, api.HttpMethod.POST],
        integration: albIntegration,
        authorizer: authorizer
    });

    apiGateway.addRoutes({
        path: '/transactions',
        methods: [api.HttpMethod.OPTIONS],
        integration: albIntegration
    });

    return apiGateway;
}