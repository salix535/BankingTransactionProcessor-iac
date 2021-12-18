from datetime import datetime
from decimal import Decimal
import json
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    transactionTable = dynamodb.Table('transaction')

    for message in event['Records']:
        processMessageAndSaveToTable(message, transactionTable)

def processMessageAndSaveToTable(message, transactionTable):
    transaction = json.loads(message['body'])
    dynamo_transaction_item = {
        'transaction_id': transaction['id'],
        'amount': Decimal(str(transaction['amount'])),
        'source_account_number': transaction['sourceAccountNumber'],
        'destination_account_number': transaction['destinationAccountNumber'],
        'creation_time': transaction['creationTime'],
        'created_by': transaction['createdBy'],
        'processing_time': datetime.now().isoformat(),
        'processed': True
    }
    transactionTable.put_item(Item = dynamo_transaction_item)
    print('Item saved successfully!')
