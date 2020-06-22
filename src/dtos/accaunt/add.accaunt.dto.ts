import * as Validator from 'class-validator';

export class AddAccauntDto {
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.Max(1000000000)
  @Validator.Min(100000000)
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
    accauntNumber: number;

    @Validator.IsNotEmpty()
    @Validator.IsIn([1,2])
    isActiv: number;


    userId: number;

    @Validator.IsString()
    @Validator.Length(0,64)
    accauntName: string;
}