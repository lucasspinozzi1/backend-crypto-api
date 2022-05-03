import { Controller, Logger, Post, Body } from "@nestjs/common";
import { CustomJson } from "common/interceptor/serialize.interceptor";
import * as _ from "lodash";
import { CreateService } from "./use-case/create.service";

type CreateRequestDTO = client.create.Schemas.CreateRequestDTO;
type CreateResponseDTO = client.create.Schemas.CreateResponseDTO;

@Controller("/client/create")
export class CreateController {
  private readonly logger = new Logger(CreateController.name);

  constructor(private readonly createService: CreateService) {}

  @CustomJson()
  @Post("/create")
  async create(
    @Body()
    createRequestDTO: CreateRequestDTO
  ): Promise<CreateResponseDTO> {
    this.logger.log("create account start");
    return this.createService.create(createRequestDTO);
  }
}
