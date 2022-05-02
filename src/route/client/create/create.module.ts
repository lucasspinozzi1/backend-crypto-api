import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'model/account.entity';
import { Client } from 'model/client.entity';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Account
    ])
  ],
  controllers: [
    CreateController
  ],
  providers: [
    CreateService
  ]
})
export class CreateModule { }
