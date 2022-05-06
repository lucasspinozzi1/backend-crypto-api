declare namespace user {
    namespace create {
        namespace Schemas {
            export interface UserDTO {
                /**
                 * clientId
                 */
                userId?: number;
            }
            export interface RegisterRequestDTO {
                identification: string;
                firstName: string;
                lastName: string;
                email: string;
                password: string;
            }
            export interface RegisterResponseDTO {
                user: UserDTO;
            }
        }
    }
}
