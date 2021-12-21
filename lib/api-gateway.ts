import api = require('@aws-cdk/aws-apigatewayv2');
import cognito = require('@aws-cdk/aws-cognito');
import integration = require('@aws-cdk/aws-apigatewayv2-integrations');
import authorizers = require('@aws-cdk/aws-apigatewayv2-authorizers');
import {Stack} from "@aws-cdk/core";
import {ApplicationListener} from "@aws-cdk/aws-elasticloadbalancingv2";

export function createBaseApyGateway(stack: Stack): api.HttpApi {
    return new api.HttpApi(stack, 'transactions-api', {
    });
}

export function configureApiGatewayBackend(apiGateway: api.HttpApi, userPool: cognito.UserPool, client: cognito.UserPoolClient,
                                    listener: ApplicationListener): void {
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
}