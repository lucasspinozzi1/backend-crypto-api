import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { TransactionService } from 'route/account/transaction/transaction.service';

describe('Movements', () => {
  let app: INestApplication;
  const transactionService = {
    listMovements: () => [{
      id: 2,
      date: 'Mon May 17 2021 11:37:53 GMT-0300 (Argentina Standard Time)',
      refNumber: '191090999',
      checkNumber: '',
      type: '1',
      categoryCode: '',
      categoryName: '',
      amount: 1,
      totalBalance: 999427,
      description: 'NC TRANSF. CTAS, TRANSACCION # 15732168 CTA SAV 2381208' +
      'CC CR31081400011023391622 CLIENTE 112233448' +
      'UAT Pruebas Cuenta tres - Test ODBRefNumber: 6205',
      account: {
        id: 1,
        accountNumber: '',
        iBAN: 'CR60081400011021450421',
        holderId: '503540061',
        holderName: 'ALEMAN POVEDA ELDER JOSUE',
        accountOfficer: 'SBRAIS',
        accountLabel: 'AJUSTE ADICIONAL',
        alias: '',
        accountType: 'A48',
        interestRate: '0',
        checkingAccount: false,
        linkableToDebitCard: false,
        transactionsAllowed: 0,
        relation: 1,
        currency: 'CRC',
        balance: 2307,
        balanceBlocked: 2307,
        balanceAvailable: 0,
        country: 'CR',
        status: 1
      }
    }]
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(TransactionService)
      .useValue(transactionService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET list of movements', async () => {
    return request(app.getHttpServer())
      .get('/account/transaction')
      .expect(201)
      .expect(transactionService.listMovements());
  });

  afterAll(async () => {
    await app.close();
  });
});
