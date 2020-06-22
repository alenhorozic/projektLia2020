import * as Validator from 'class-validator';

export class EditAccauntDto {

    @Validator.IsIn([1,2])
    @Validator.IsOptional()
    isActiv: number;

    @Validator.IsString()
    @Validator.Length(0,64)
    @Validator.IsOptional()
    accauntName: string;
}