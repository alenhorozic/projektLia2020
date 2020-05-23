import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accaunt } from "./accaunt.entity";

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
  amount: number;

  @Column("timestamp", {
    name: "transaktion_at",
    default: () => "'0000-00-00 00:00:00'",
  })
  transaktionAt: Date;

  @Column("int", { name: "transaktion_to_accaunt_number", unsigned: true })
  transaktionToAccauntNumber: number ;

  @Column("enum", {
    name: "status",
    enum: ["weiting", "peyd", "error"],
    default: () => "'weiting'",
  })
  status: "weiting" | "peyd" | "error";

  @ManyToOne(() => Accaunt, (accaunt) => accaunt.commingTransaktions, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "accaunt_id", referencedColumnName: "accauntId" }])
  accaunt: Accaunt;
}
