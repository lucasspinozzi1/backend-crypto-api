import { Module } from '@nestjs/common';
import { CreateModule } from './create/create.module';


@Module({
  imports: [
    CreateModule
  ],
  controllers: [
  ],
  providers: [
  ]
})
export class ClientModule { }
