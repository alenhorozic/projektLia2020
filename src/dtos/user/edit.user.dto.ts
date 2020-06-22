import * as Validator from 'class-validator';

export class EditUserDto {

   
    @Validator.IsString()
    @Validator.Length(4,128)
    @Validator.IsOptional()
    password: string;

   
    @Validator.IsString()
    @Validator.Matches(/^[0-9]{7,24}$/)
    @Validator.IsOptional()
    phoneNumber: string
}