import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Account } from './account.entity';
import { Currency } from './currency';
import { TransactionStatus } from './transaction-status';
import { TransactionType } from './transaction-type';

@Entity('transaction')
export class Transaction {

  @PrimaryGeneratedColumn({
    name: 'transaction_id'
  })
  transactionId: number;

  @Column()
  amount: string;

  @Column()
  currency: Currency;

  @Column({
    name: 'credit_debit_indicator'
  })
  creditDebitIndicator: TransactionType;

  @Column()
  status: TransactionStatus;

  @Column({
    name: 'booking_date_time'
  })
  bookingDateTime: Date;

  @Column({
    name: 'value_date_time'
  })
  valueDateTime: Date;

  @Column({
    name: 'transaction_information'
  })
  transactionInformation: string;

  @Column()
  category: string;

  @Column()
  balance: string;

  @Column({
    name: 'account_id'
  })
  accountId: number;

  @ManyToOne(
    () => Account,
    (account) => account.transactions
  )
  @JoinColumn({ name: 'account_id' })
  account: Account;

}
