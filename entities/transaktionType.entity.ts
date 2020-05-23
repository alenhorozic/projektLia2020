import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaktion } from "./transaktion.entity";

@Entity("transaktion_type",)
export class TransaktionType {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "transaktion_type_id",
    unsigned: true,
  })
  transaktionTypeId: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @OneToMany(() => Transaktion, (transaktion) => transaktion.transaktionType)
  transaktions: Transaktion[];
}
