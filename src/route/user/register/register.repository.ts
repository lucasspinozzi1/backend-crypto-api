import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterRepository } from "./use-case/register.repository";
import { UserDTO } from "./use-case/repository/user.dto";
import RegisterUserRequestDTO from "./use-case/repository/register-client-request.dto";
import { User } from "model/user.entity";

export class RegisterRepositoryImpl implements RegisterRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerUser(
    registerUserRequestDTO: RegisterUserRequestDTO
  ): Promise<UserDTO> {
    return await this.userRepository.save(registerUserRequestDTO);
  }
}
