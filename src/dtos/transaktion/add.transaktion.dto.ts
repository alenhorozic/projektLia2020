import * as Validator from 'class-validator';

export class AddTransaktionDto {

    @Validator.IsNotEmpty()
    @Validator.IsIn([1,2])
    transaktionTypeId: number;



  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
    accauntId: number;


  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
    amount: number;

    

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowNaN: false,
      maxDecimalPlaces: 0,
    })
    userId: number;
}