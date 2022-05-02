import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { DetailService } from 'route/account/detail/detail.service';

describe('Account Balance', () => {
  let app: INestApplication;

  const detailService = {
    detail: jest.fn().mockResolvedValue({
      status: 'Enabled',
      statusUpdateDateTime: 'Mon May 17 2021 11:37:53 GMT-0300 (Argentina Standard Time)',
      name: 'CR60081400011021450421',
      balances: [
        {
          creditDebitIndicator: 'Credit',
          type: 'Information',
          dateTime: 'Mon May 17 2021 11:37:53 GMT-0300 (Argentina Standard Time)',
          amount: {
            amount: '0',
            currency: 'CRC'
          }
        }
      ]
    })
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DetailService]
    })
      .overrideProvider(DetailService)
      .useValue(detailService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET account balance', async () => {
    return request(app.getHttpServer())
      .post('/account/detail/detail')
      .send([
        'CR60081400011021450421',
        {},
        'CRC'
      ])
      .expect(201)
      .expect({
        status: 'Enabled',
        statusUpdateDateTime: 'Mon May 17 2021 11:37:53 GMT-0300 (Argentina Standard Time)',
        name: 'CR60081400011021450421',
        balances: [
          {
            creditDebitIndicator: 'Credit',
            type: 'Information',
            dateTime: 'Mon May 17 2021 11:37:53 GMT-0300 (Argentina Standard Time)',
            amount: {
              amount: '0',
              currency: 'CRC'
            }
          }
        ]
      })
      .then(() => {
        expect(detailService.detail).toHaveBeenCalledTimes(1);
        expect(detailService.detail.mock.calls[0][0]).toStrictEqual({
          identification: 'CR60081400011021450421',
          currency: 'CRC',
          supplementaryData: {}
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
