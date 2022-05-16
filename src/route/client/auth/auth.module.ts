import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'model/client.entity';
import { AuthController } from './auth.controller';
import { AuthRepositoryImpl } from './auth.repository';
import { AuthService } from './use-case/auth.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client
    ])
  ],
  controllers: [
    AuthController
  ],
  providers: [
    {
      provide: AuthService,
      useFactory(
          createRepository: AuthRepositoryImpl,
          //createGateway: CreateGateway
        ) {
        return new AuthService(
          createRepository,
          //createGateway,
          new Logger(AuthService.name)
        );
      },
      // inject: [CreateRepositoryImpl, CreateGateway]
      inject: [AuthRepositoryImpl]
    },
    AuthRepositoryImpl,
    // CreateGateway
  ]
})
export class AuthModule { }
