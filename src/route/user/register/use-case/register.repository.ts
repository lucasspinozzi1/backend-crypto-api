import RegisterClientRequestDTO from "./repository/register-client-request.dto";
import { UserDTO } from "./repository/user.dto";

export class RegisterRepository {
  async registerUser(_registerClientRequestDTO: RegisterClientRequestDTO): Promise<UserDTO> {
    return Promise.reject('To be implemented');
  }

}