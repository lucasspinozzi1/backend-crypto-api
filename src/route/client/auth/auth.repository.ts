import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "model/client.entity";
import { Repository } from "typeorm";
import { AuthRepository } from "./use-case/auth.repository";
import { ClientDTO } from "./use-case/repository/client.dto";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async findByEmail(
    email: string
  ): Promise<ClientDTO> {
    console.log('loginClientRepository: ', email)
    const result =  await this.clientRepository.findOne({ email: email });
    console.log('Result findeOne = ', result)
    return result;
  }
}