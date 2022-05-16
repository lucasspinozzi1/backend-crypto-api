import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "model/client.entity";
import { CreateController } from "./create.controller";
import { CreateRepositoryImpl } from "./create.repository";
import { CreateGateway } from "./use-case/create.gateway";
import { CreateService } from "./use-case/create.service";

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [CreateController],
  providers: [
    {
      provide: CreateService,
      useFactory(
        createRepository: CreateRepositoryImpl,
        createGateway: CreateGateway
      ) {
        return new CreateService(
          createRepository,
          createGateway,
          new Logger(CreateService.name)
        );
      },
      inject: [CreateRepositoryImpl, CreateGateway],
    },
    CreateRepositoryImpl,
    CreateGateway,
  ],
})
export class CreateModule {}
