import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { ChangePinService } from 'route/card/change-pin/use-case/change-pin.service';

describe('Account Balance', () => {
  let app: INestApplication;

  const changePinService = {
    changePin: jest.fn().mockResolvedValue({
      cardId: '2341 2324 2134 1234',
      supplementaryData: {}
    })
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ChangePinService]
    })
      .overrideProvider(ChangePinService)
      .useValue(changePinService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST change card pin', async () => {
    return request(app.getHttpServer())
      .post('/card/change-pin/change-pin')
      .send([
        {
          clientId: '01',
          providerCardId: '2341 2324 2134 1234',
          currentPin: '0000',
          nextPin: '1234',
          supplementaryData: {}
        }
      ])
      .expect(201)
      .expect({
        cardId: '2341 2324 2134 1234',
        supplementaryData: {}
      })
      .then(() => {
        expect(changePinService.changePin).toHaveBeenCalledTimes(1);
        expect(changePinService.changePin.mock.calls[0][0]).toStrictEqual({
          clientId: '01',
          cardId: '2341 2324 2134 1234',
          currentPin: '0000',
          nextPin: '1234',
          supplementaryData: {}
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
