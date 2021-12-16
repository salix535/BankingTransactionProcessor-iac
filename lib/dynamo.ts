import dynamo = require('@aws-cdk/aws-dynamodb');
import iam = require('@aws-cdk/aws-iam');
import {RemovalPolicy, Stack} from "@aws-cdk/core";

export function createDynamoTable(stack: Stack, taskRole: iam.Role): dynamo.Table {

    const table = new dynamo.Table(stack, 'btp-table', {
        partitionKey: { name: 'transaction_id', type: dynamo.AttributeType.STRING },
        billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
        tableName: 'Transaction'
    });

    table.grantReadData(taskRole);

    table.applyRemovalPolicy(RemovalPolicy.DESTROY);

    return table;
}