import { Gateway, ToProvide } from "common/resolver/gateway";
import RegisterRequestDTO from "./gateway/register-request.dto";
import RegisterResponseDTO from "./gateway/register-response.dto";

@Gateway()
export class RegisterGateway {

  @ToProvide()
  async register(
    _registerRequestDTO: RegisterRequestDTO
  ): Promise<RegisterResponseDTO> {
    return Promise.reject('To be implemented');
  }
}
