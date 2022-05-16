import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CreateModule } from './create/create.module';

@Module({
  imports: [
    CreateModule,
    AuthModule
  ],
  controllers: [
  ],
  providers: [
  ]
})
export class ClientModule { }
