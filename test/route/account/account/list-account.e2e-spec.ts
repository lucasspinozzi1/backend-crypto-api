import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { AccountService } from 'route/account-dev/account.service';

describe('Account', () => {
  let app: INestApplication;
  const accountService = {
    listAccounts: () => [{
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
    }]
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(AccountService)
      .useValue(accountService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET list of accounts', async () => {
    return request(app.getHttpServer())
      .get('/Account/dev/account')
      .expect(201)
      .expect(accountService.listAccounts());
  });

  afterAll(async () => {
    await app.close();
  });
});
