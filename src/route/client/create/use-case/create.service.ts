import "dotenv/config";
import { Injectable, Logger } from "@nestjs/common";
import * as _ from "lodash";
import { CreateGateway } from "./create.gateway";
import { CreateRepository } from "./create.repository";
import { Appwrite } from "appwrite";

type CreateRequestDTO = client.create.Schemas.CreateRequestDTO;
type CreateResponseDTO = client.create.Schemas.CreateResponseDTO;

@Injectable()
export class CreateService {
  constructor(
    private readonly createRepository: CreateRepository,
    private readonly createGateway: CreateGateway,
    private readonly logger: Logger
  ) {}

  async create(createRequestDTO: CreateRequestDTO): Promise<CreateResponseDTO> {
    this.logger.log("create client service");
    // In this method we can connect with an external dynamic provider to handle diferents types of clients.
    let { identification, firstName, lastName, email } = createRequestDTO;
    // await this.createGateway.create({}); // EXAMPLE Gateway call
    const sdk = new Appwrite();

    sdk
      .setEndpoint(process.env.APPWRITE_API_ENDPOINT) // Your API Endpoint
      .setProject(process.env.APPWRITE_PROJECT); // Your project ID

    sdk.account.create(
      "unique()",
      "email@email222.com",
      "password",
      "nombreUsuario3"
    );

    // const client = await this.createRepository.createClient({
    //   identification,
    //   firstName,
    //   lastName,
    //   email,
    // });

    // return Promise.resolve({ client, wallets: [] });
    return;
  }
}
