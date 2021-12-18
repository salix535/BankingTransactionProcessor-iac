import {RemovalPolicy, Stack} from "@aws-cdk/core";
import cognito = require('@aws-cdk/aws-cognito');

export function myUserPool(stack: Stack){
    const pool = new cognito.UserPool(stack, 'btp-user-pool-id', {
        selfSignUpEnabled: true,
        userPoolName: 'btp-user-pool',
        autoVerify: {
            email: true
        },
        standardAttributes: {
            email: {
                required: true,
                mutable: false
            },
            givenName: {
                required: true,
                mutable: true
            },
            familyName: {
                required: true,
                mutable: false
            }
        },
        userVerification: {
            emailSubject: 'Verify your email for btp!',
            emailBody: 'Thanks for signing up to btp! Your verification code is {####}',
            emailStyle: cognito.VerificationEmailStyle.CODE
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        passwordPolicy: {
            minLength: 8,
            requireDigits: true,
            requireLowercase: true,
            requireSymbols: true,
            requireUppercase: true
        },
    });
    pool.addDomain("btp-user-pool-domain-id", {
        cognitoDomain: {
            domainPrefix: 'banking-transaction-processor'
        }
    });

    const fullAccessScope = new cognito.ResourceServerScope({ scopeName: '*', scopeDescription: 'Full access' });

    const resourceServer = pool.addResourceServer('TransactionsResourceServer', {
        identifier: 'btp-resource-server',
        scopes: [fullAccessScope]
    });

    const client = pool.addClient("btp-frontend-client-id", {
        userPoolClientName: 'btp-frontend-client',
        generateSecret: true,
        oAuth: {
            flows: {
                authorizationCodeGrant: true,
                implicitCodeGrant: true
            },
            scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.resourceServer(resourceServer, fullAccessScope)],
            callbackUrls: ['http://localhost:8080/callback'],
            logoutUrls: ['http://localhost:8080/logout']
        }
    });

    client.applyRemovalPolicy(RemovalPolicy.DESTROY);

    return {client, pool};
}