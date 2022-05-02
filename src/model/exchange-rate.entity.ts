import {
  Entity,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';
import { RateType } from './rate-type';

@Entity('exchange_rate')
export class ExchangeRate {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    name: 'exchange_rate'
  })
  exchangeRate: string;

  @Column({
    name: 'amount_traded'
  })
  amountTraded: number;

  @Column({
    name: 'contratc_identification'
  })
  contractIdentification: string;

  @Column({
    name: 'source_currency'
  })
  sourceCurrency: string;

  @Column({
    name: 'target_currency'
  })
  targetCurrency: string;

  @Column({
    name: 'quotation_date'
  })
  quotationDate: Date;

  @Column({
    name: 'expiration_datetime'
  })
  expirationDateTime: Date;

  @Column()
  rateType: RateType;
}
