import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CommingTransaktion } from "./commingTransaktion.entity";
import { Transaktion } from "./transaktion.entity";

@Index("uq_accaunt_number_accaunt", ["accauntNumber"], { unique: true })
@Index("fk_accaunt_usr_id", ["userId"], {})
@Entity("accaunt", { schema: "bank" })
export class Accaunt {
  @PrimaryGeneratedColumn({ type: "int", name: "accaunt_id", unsigned: true })
  accauntId: number;

  @Column("timestamp", {
    name: "crated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  cratedAt: Date;

  @Column("int", { name: "accaunt_number", unique: true, unsigned: true })
  accauntNumber: number;

  @Column("tinyint", { name: "is_activ", unsigned: true })
  isActiv: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "accaunt_name", length: 64 })
  accauntName: string;

  @ManyToOne(() => User, (user) => user.accaunts, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(
    () => CommingTransaktion,
    (commingTransaktion) => commingTransaktion.accaunt
  )
  commingTransaktions: CommingTransaktion[];

  @OneToMany(() => Transaktion, (transaktion) => transaktion.accaunt)
  transaktions: Transaktion[];
}
