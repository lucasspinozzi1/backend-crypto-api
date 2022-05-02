import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientModule } from './client/client.module';

@Global()
@Module({
  imports: [
    ClientModule
  ],
  controllers: [
    AppController
  ],
  providers: [
  ],
  exports: [
  ]
})
export class RouteModule { }
