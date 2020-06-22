import * as Validator from 'class-validator';

export class LoginAdministratorDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[A-z][a-z0-9]{3,63}$/)
    username: string;

    password: string;
}