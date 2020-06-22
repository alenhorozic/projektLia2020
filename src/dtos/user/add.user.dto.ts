import * as Validator from 'class-validator';

export class AddUserDto {

    @Validator.IsNotEmpty()
    @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
  })
    email: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(4,128)
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,64)
    forname: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,64)
    surname: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[0-9]{7,24}$/)
    phoneNumber: string
}