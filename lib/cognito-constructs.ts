import {OAuthScope} from "@aws-cdk/aws-cognito";
import {aws_cognito, Stack} from "aws-cdk-lib";

export function myUserPool(stack: Stack): aws_cognito.UserPool {
    const pool = new aws_cognito.UserPool(stack, 'myuserpool', {
        selfSignUpEnabled: true,
        userPoolName: 'myawesomeapp-userpool',
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
        signInCaseSensitive: true,
        passwordPolicy: {
            minLength: 8,
            requireDigits: true,
            requireLowercase: true,
            requireSymbols: true,
            requireUppercase: true
        },
    });
    pool.addDomain("domain_id", {
        cognitoDomain: {
            domainPrefix: 'banking-transaction-processor-test'
        }
    });
    pool.addClient("app-client", {
        userPoolClientName: 'app-client',
        generateSecret: true,
        oAuth: {
            flows: {
                authorizationCodeGrant: true,
                implicitCodeGrant: true
            },
            scopes: [OAuthScope.EMAIL, OAuthScope.OPENID],
            callbackUrls: ['http://localhost:8080/callback'],
            logoutUrls: ['http://localhost:8080/logout']
        }
    });
    return pool;
}