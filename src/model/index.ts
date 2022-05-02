import { Account } from "./account.entity";
import { Client } from "./client.entity";
import { ExchangeRate } from "./exchange-rate.entity";
import { ExternalAccount } from "./external-account";
import { Servicer } from "./servicer.entity";
import { Transaction } from "./transaction.entity";

export const ENTITIES = [
    Account,
    Client,
    ExchangeRate,
    Servicer,
    Transaction,
    ExternalAccount
];
