import { ClientDTO } from "./repository/client.dto";

export class AuthRepository {
  async findByEmail(_email: string): Promise<ClientDTO> {
    return Promise.reject('To be implemented');
  }

}
