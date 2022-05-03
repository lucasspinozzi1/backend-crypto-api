import { ClientDTO } from "./repository/client.dto";
import CreateClientRequestDTO from "./repository/create-client-request.dto";

export class CreateRepository {
  async createClient(_createClientRequestDTO: CreateClientRequestDTO): Promise<ClientDTO> {
    return Promise.reject('To be implemented');
  }

}
