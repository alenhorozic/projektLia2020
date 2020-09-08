import * as Validator from 'class-validator';

export class AddCommingTransaktionDto {

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
    
    transaktionAt: Date;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowNaN: false,
      maxDecimalPlaces: 0,
    })
    transaktionToAccauntNumber: number;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["weiting", "peyd", "error"])
  status: "weiting" | "peyd" | "error";

  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
    userId: number;
}