import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'model/user.entity';
import { RegisterController } from './register.controller';
import { RegisterRepositoryImpl } from './register.repository';
import { RegisterGateway } from './use-case/register.gateway';
import { RegisterService } from './use-case/register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [
    RegisterController
  ],
  providers: [
    {
      provide: RegisterService,
      useFactory(
          registerRepository: RegisterRepositoryImpl,
          registerGateway: RegisterGateway
        ) {
        return new RegisterService(
          registerRepository,
          registerGateway,
          new Logger(RegisterGateway.name)
        );
      },
      inject: [RegisterRepositoryImpl, RegisterGateway]
    },
    RegisterRepositoryImpl,
    RegisterGateway
  ]
})
export class RegisterModule { }
