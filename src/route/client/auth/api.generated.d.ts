declare namespace client {
    namespace register {
        namespace Schemas {
            export interface ClientDTO {
                /**
                 * clientId
                 */
                clientId?: number;
            }
            export interface LoginRequestDTO {
                email: string;
                password: string;
            }
            export interface LoginResponseDTO { 
                token: string;
            }
        }
    }
}
