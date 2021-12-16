import api = require('@aws-cdk/aws-apigatewayv2');
import cognito = require('@aws-cdk/aws-cognito');
import integration = require('@aws-cdk/aws-apigatewayv2-integrations');
import authorizers = require('@aws-cdk/aws-apigatewayv2-authorizers');
import {Stack} from "@aws-cdk/core";
import {ApplicationListener} from "@aws-cdk/aws-elasticloadbalancingv2";

export function createApiGateway(stack: Stack, userPool: cognito.UserPool, client: cognito.UserPoolClient, listener: ApplicationListener): api.HttpApi {

    const albIntegration = new integration.HttpAlbIntegration('alb-integration-id', listener);

    const authorizer = new authorizers.HttpUserPoolAuthorizer( 'btp-user-pool-authorizer',userPool,{
        userPoolClients: [client],
    });

    const transactionsApi = new api.HttpApi(stack, 'transactions-api', {
        defaultIntegration: albIntegration,
        defaultAuthorizer: authorizer
    });

    transactionsApi.addRoutes({
        path: '/transactions',
        methods: [api.HttpMethod.GET, api.HttpMethod.POST],
        integration: albIntegration
    })

    return transactionsApi;
}