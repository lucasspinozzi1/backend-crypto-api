declare const module: {hot?: {accept: Function; dispose: Function}};
import * as swaggerUi from 'swagger-ui-express';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { swaggerJSDoc } from 'lib';
import { exist } from 'common/util';
import { AppModule } from 'app.module';

const PORT = exist(process.env.PORT)? process.env.PORT: 3002;

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, (req, res: Response, next)=>{
    swaggerJSDoc({
      swaggerDefinition: {
        components: {},
        info:{
          title: '0mn1 backend services',
          version: '1.0.0'
        },
        openapi: '3.0.1'
      },
      apis: ['./src/**/*openapi.yaml']
    }).then(function(swaggerSpec){
      swaggerUi.setup(swaggerSpec)(req, res, next);
    }).catch(function(reason){
      res.status(500).send(reason);
    });
  });
  await app.listen(PORT, '0.0.0.0');
  if (exist(module.hot)) {
    module.hot.accept();
    module.hot.dispose(async () => {
      return app.close();
    });
  }
  logger.log(`App listening on port ${PORT}`);
}
bootstrap()
  .then(()=>{
    logger.log('app bootstrap succesfully');
  })
  .catch((reason)=>{
    logger.log(`bootstrap error: ${reason}`);
  });

