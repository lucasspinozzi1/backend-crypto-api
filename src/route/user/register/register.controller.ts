import { Controller, Logger, Post, Body } from "@nestjs/common";
import { CustomJson } from "common/interceptor/serialize.interceptor";
import * as _ from "lodash";
import { RegisterService } from "./use-case/register.service";

type RegisterRequestDTO = user.create.Schemas.RegisterRequestDTO;
type RegisterResponseDTO = user.create.Schemas.RegisterResponseDTO;

@Controller("/user/register")
export class RegisterController {
  private readonly logger = new Logger(RegisterController.name);

  constructor(private readonly registerService: RegisterService) {}

  @CustomJson()
  @Post("/register")
  async register(
    @Body()
    registerRequestDTO: RegisterRequestDTO
  ): Promise<RegisterResponseDTO> {
    this.logger.log("register user start");
    return this.registerService.register(registerRequestDTO);
  }
}
