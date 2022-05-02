import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Account } from './account.entity';
import { ExternalAccount } from './external-account';

@Entity('servicer')
export class Servicer {

  @PrimaryGeneratedColumn({
    name: 'servicer_id'
  })
  servicerId: string;

  @Column()
  identification: string;

  @Column({
    name: 'scheme_name'
  })
  schemeName: string;

  @OneToMany(
    () => Account,
    (accounts) => accounts.servicer
  )
  accounts: Array<Account>;

  @OneToMany(
    () => ExternalAccount,
    (externalAccount) => externalAccount.servicer
  )
  externalAccounts: Array<ExternalAccount>;
}
