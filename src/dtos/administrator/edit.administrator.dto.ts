import * as Validator from 'class-validator';

export class EditAdministratorDto {

    @Validator.IsString()
    @Validator.Length(4,128)
    @Validator.IsOptional()
    password: string;

    @Validator.IsOptional()
    @Validator.IsEmail({
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    })
    email: string;
}