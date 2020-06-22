import * as Validator from 'class-validator';

export class AddAdministratorDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[A-z][a-z0-9]{3,63}$/)
    username: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(4,128)
    password: string;
    
    @Validator.IsNotEmpty()
    @Validator.IsEmail({
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    })
    email: string;
}