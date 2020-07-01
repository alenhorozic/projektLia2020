import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accaunt } from "./accaunt.entity";
import * as Validator from 'class-validator';

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user")
export class User {
  map(arg0: (user: User) => void) {
      throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
  })
  email: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("varchar", { name: "forname", length: 64 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,64)
  forname: string;

  @Column("varchar", { name: "surname", length: 64 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,64)
  surname: string;

  @Column("varchar", {
    name: "phone_number",
    unique: true,
    length: 24,
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[0-9]{7,24}$/)
  phoneNumber: string;

  @OneToMany(() => Accaunt, (accaunt) => accaunt.user)
  accaunts: Accaunt[];
}
