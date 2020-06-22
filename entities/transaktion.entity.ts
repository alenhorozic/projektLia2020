import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accaunt } from "./accaunt.entity";
import { TransaktionType } from "./transaktionType.entity";
import * as Validator from 'class-validator';

@Index(
  "fk_transaktion_transaktion_transaktion_type_id",
  ["transaktionTypeId"],
  {}
)
@Index("fk_transaktion_accaunt_id", ["accauntId"], {})
@Entity("transaktion")
export class Transaktion {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "transaktion_id",
    unsigned: true,
  })
  transaktionId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", { name: "transaktion_type_id", unsigned: true })
  transaktionTypeId: number;

  @Column("int", { name: "accaunt_id", unsigned: true })
  accauntId: number;

  @Column("decimal", {
    name: "amount",
    unsigned: true,
    precision: 10,
    scale: 2,
  })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  amount: number;

  @ManyToOne(() => Accaunt, (accaunt) => accaunt.transaktions, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "accaunt_id", referencedColumnName: "accauntId" }])
  accaunt: Accaunt;

  @ManyToOne(
    () => TransaktionType,
    (transaktionType) => transaktionType.transaktions,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([
    { name: "transaktion_type_id", referencedColumnName: "transaktionTypeId" },
  ])
  transaktionType: TransaktionType;
}
