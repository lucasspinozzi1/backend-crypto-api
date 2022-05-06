import { Injectable, Logger } from "@nestjs/common";
import { RegisterGateway } from "./register.gateway";
import { RegisterRepository } from "./register.repository";

type RegisterRequestDTO = user.create.Schemas.RegisterRequestDTO;
type RegisterResponseDTO = user.create.Schemas.RegisterResponseDTO;

@Injectable()
export class RegisterService {
  constructor(
    private readonly registerRepository: RegisterRepository,
    private readonly registerGateway: RegisterGateway,
    private readonly logger: Logger
  ) {}

  async register(registerRequestDTO: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    this.logger.log("register user service")
    // In this method we can connect with an external dynamic provider to handle diferents types of clients.
    let { identification, firstName, lastName, password, email } = registerRequestDTO;
    // await this.registerGateway.create({}); // EXAMPLE Gateway call
    const user = await this.registerRepository.registerUser({
      identification,
      firstName,
      lastName,
      email,
      password
    });

    return Promise.resolve({ user, wallets: [] });
  } 
}