import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accaunt } from "./accaunt.entity";

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 128,
  })
  email: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;

  @Column("varchar", { name: "forname", length: 64 })
  forname: string;

  @Column("varchar", { name: "surname", length: 64 })
  surname: string;

  @Column("varchar", {
    name: "phone_number",
    unique: true,
    length: 24,
  })
  phoneNumber: string;

  @OneToMany(() => Accaunt, (accaunt) => accaunt.user)
  accaunts: Accaunt[];
}
