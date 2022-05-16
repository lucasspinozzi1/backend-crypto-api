import { Gateway, ToProvide } from "common/resolver/gateway";
import CreateRequestDTO from "./gateway/create-request.dto";
import CreateResponseDTO from "./gateway/create-responde.dto";

@Gateway()
export class CreateGateway {
  @ToProvide()
  async create(
    _createRequestDTO: CreateRequestDTO
  ): Promise<CreateResponseDTO> {
    return Promise.reject("To be implemented");
  }
}
