import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Servicer } from './servicer.entity';
import { AccountStatus } from './account-status';
import { AccountType } from './account-type';
import { Currency } from './currency';
import { Client } from './client.entity';

@Entity('account')
export class Account {

  @PrimaryGeneratedColumn({
    name: 'account_id'
  })
  accountId: number;

  @Column()
  identification: string;

  @Column({
    name: 'client_id'
  })
  clientId: number;

  @Column({
    name: 'secondary_identification'
  })
  secondaryIdentification: string;

  @Column({
    name: 'scheme_name'
  })
  schemeName: string;

  @Column()
  status: AccountStatus;

  @Column({
    name: 'status_update_date_time',
    type: 'timestamp'
  })
  statusUpdateDateTime: Date;

  @Column()
  currency: Currency;

  @Column({
    name: 'account_type'
  })
  accountType: AccountType;

  @Column()
  balance: number;

  @Column()
  nickname: string;

  @Column()
  name: string;

  @Column({
    name: 'opening_date',
    type: 'timestamp'
  })
  openingDate: Date;

  @ManyToOne(
    () => Client,
    (client) => client.accounts
  )
  @JoinColumn({
    name: 'client_id'
  })
  client: Client;

  @OneToMany(
    () => Transaction,
    (transactions) => transactions.account
  )
  transactions: Array<Transaction>;

  @ManyToOne(
    () => Servicer,
    (servicer) => servicer.accounts
  )
  @JoinColumn({
    name: 'servicer_id'
  })
  servicer: Servicer;

}
