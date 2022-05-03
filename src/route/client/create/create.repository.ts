import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "model/client.entity";
import { Repository } from "typeorm";
import { CreateRepository } from "./use-case/create.repository";
import { ClientDTO } from "./use-case/repository/client.dto";
import CreateClientRequestDTO from "./use-case/repository/create-client-request.dto";

export class CreateRepositoryImpl implements CreateRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async createClient(
    createClientRequestDTO: CreateClientRequestDTO
  ): Promise<ClientDTO> {
    return await this.clientRepository.save(createClientRequestDTO);
  }
}
