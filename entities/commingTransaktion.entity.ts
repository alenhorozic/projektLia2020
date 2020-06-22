import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accaunt } from "./accaunt.entity";
import * as Validator from 'class-validator';

@Index("fk_comming_transaktion_accaunt_id", ["accauntId"], {})
@Entity("comming_transaktion")
export class CommingTransaktion {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "comming_transaktion_id",
    unsigned: true,
  })
  commingTransaktionId: number;

  @Column("int", { name: "accaunt_id", unsigned: true })
  accauntId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", { name: "amount", unsigned: true })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  amount: number;

  @Column("timestamp", {
    name: "transaktion_at",
    default: () => "'0000-00-00 00:00:00'",
  })
  transaktionAt: Date;

  @Column("int", { name: "transaktion_to_accaunt_number", unsigned: true })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.Max(1000000000)
  @Validator.Min(100000000)
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  transaktionToAccauntNumber: number ;

  @Column("enum", {
    name: "status",
    enum: ["weiting", "peyd", "error"],
    default: () => "'weiting'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["weiting", "peyd", "error"])
  status: "weiting" | "peyd" | "error";

  @ManyToOne(() => Accaunt, (accaunt) => accaunt.commingTransaktions, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "accaunt_id", referencedColumnName: "accauntId" }])
  accaunt: Accaunt;
}
