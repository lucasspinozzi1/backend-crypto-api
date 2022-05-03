declare namespace client {
    namespace create {
        namespace Schemas {
            export interface ClientDTO {
                /**
                 * clientId
                 */
                clientId?: number;
            }
            export interface CreateRequestDTO {
                identification: string;
                firstName: string;
                lastName: string;
                email: string;
                /**
                 * additional information that can not be captured in the structured fields and/or any other specific block
                 */
                providerMetadata: unknown;
            }
            export interface CreateResponseDTO {
                client: ClientDTO;
            }
        }
    }
}
