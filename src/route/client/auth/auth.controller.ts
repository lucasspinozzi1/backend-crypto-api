import { Controller, Logger, Post, Body, ValidationPipe, UsePipes } from "@nestjs/common";
import { CustomJson } from "common/interceptor/serialize.interceptor";
import * as _ from "lodash";
import { AuthService } from "./use-case/auth.service";
import { LoginDto } from "./use-case/loginDto";

type LoginRequestDTO = client.register.Schemas.LoginRequestDTO;
type LoginResponseDTO = client.register.Schemas.LoginResponseDTO;

@Controller("/client/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly createService: AuthService) {}

  @CustomJson()
  @Post("/login")
  @UsePipes(ValidationPipe)
  async login(
    @Body()
    loginRequestDTO: LoginDto
  ): Promise<LoginResponseDTO> {
    this.logger.log("login start");
    return this.createService.login(loginRequestDTO);
  }
}
