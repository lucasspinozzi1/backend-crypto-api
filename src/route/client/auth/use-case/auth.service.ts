import { Injectable, Logger, Res } from "@nestjs/common";
import { CodeError, responseCode, ResponseHandler } from "helpers/Response";
import * as _ from "lodash";
import { AuthRepository } from "./auth.repository";

type LoginRequestDTO = client.register.Schemas.LoginRequestDTO;
type LoginResponseDTO = client.register.Schemas.LoginResponseDTO;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    //private readonly createGateway: CreateGateway,
    private readonly logger: Logger
  ) {}

  async login(createRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const Response = new ResponseHandler(this.logger, 'login');

    this.logger.log("Login client service");

    let { email, password } = createRequestDTO;
    const token = 'Token generated';
    // await this.createGateway.create({}); // EXAMPLE Gateway call
    const client = await this.authRepository.findByEmail(email);
    //TODO: ADD FUNCTIONS TO VALIDATE THE CLIENT
    const response= Response.success(responseCode.LOGGED);
    
    return Promise.resolve({ response, token });
  }
}
