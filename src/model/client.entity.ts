import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { Account } from './account.entity';
import { ExternalAccount } from './external-account';

@Entity('client')
@Unique(['identification'])
export class Client {

  @PrimaryGeneratedColumn({
    name: 'client_id'
  })
  clientId: number;

  // 'DNI' 'CEDULA'
  @Column()
  identification: string;

  @Column({
    name: 'first_name'
  })
  firstName: string;

  @Column({
    name: 'last_name'
  })
  lastName: string;

  @Column()
  email: string;

  @OneToMany(
    () => Account,
    (account) => account.client
  )
  accounts: Array<Account>;

  @OneToMany(
    () => ExternalAccount,
    (externalAccount) => externalAccount.client
  )
  externalAccounts: Array<ExternalAccount>;
}
