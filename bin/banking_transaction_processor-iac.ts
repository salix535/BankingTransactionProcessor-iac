#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BankingTransactionProcessorIacStack } from '../lib/banking_transaction_processor-iac-stack';

const app = new cdk.App();
new BankingTransactionProcessorIacStack(app, 'BankingTransactionProcessorIacStack', {
});