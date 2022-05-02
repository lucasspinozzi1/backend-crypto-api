import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn
} from 'typeorm';
import { Servicer } from './servicer.entity';
import { AccountType } from './account-type';
import { Currency } from './currency';
import { Client } from './client.entity';

@Entity('external_account')
@Unique(['identification', 'currency'])
export class ExternalAccount {

  @PrimaryGeneratedColumn({
    name: 'external_account_id'
  })
  externalAccountId: string;

  @Column()
  identification: string;

  @Column()
  name: string;

  @Column()
  currency: Currency;

  @Column({
    name: 'external_account_type'
  })
  externalAccountType: AccountType;

  @Column({
    name: 'client_id',
    nullable: true
  })
  clientId: number;

  @ManyToOne(
    () => Servicer,
    (servicer) => servicer.externalAccounts
  )
  @JoinColumn({
    name: 'servicer_id'
  })
  servicer: Servicer;

  @ManyToOne(
    () => Client,
    (client) => client.externalAccounts
  )
  @JoinColumn({
    name: 'client_id'
  })
  client: Client;

}
