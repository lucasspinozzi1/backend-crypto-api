import { IsNotEmpty, IsString } from "class-validator";

type LoginRequestDTO = client.register.Schemas.LoginRequestDTO;

export class LoginDto implements LoginRequestDTO  {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
      }
}
