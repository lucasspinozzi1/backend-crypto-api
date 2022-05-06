import { Module } from '@nestjs/common';
import { RegisterModule } from '../user/register/register.module';


@Module({
  imports: [
    RegisterModule
  ],
  controllers: [
  ],
  providers: [
  ]
})
export class UserModule { }
