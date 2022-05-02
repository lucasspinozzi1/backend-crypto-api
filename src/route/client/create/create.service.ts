import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as _ from "lodash";
import { Client } from "model/client.entity";

type CreateRequestDTO = client.create.Schemas.CreateRequestDTO;
type CreateResponseDTO = client.create.Schemas.CreateResponseDTO;

@Injectable()
export class CreateService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async create({
    identification = "",
    firstName,
    lastName,
    email,
    providerMetadata,
  }: CreateRequestDTO): Promise<CreateResponseDTO> {
    // In this method we can connect with an external dynamic provider to handle diferents types of clients.
    const client = await this.clientRepository.save({
      identification,
      firstName,
      lastName,
      email,
    });

    return Promise.resolve({ client, wallets: [] });
  }
}
