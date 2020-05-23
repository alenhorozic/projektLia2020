import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator")
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column( {
    type: "varchar",
    name: "username",
    unique: true,
    length: 64,
    default: () => "'0'",
  })
  username: string;

  @Column( {
    type: "varchar",
    name: "password_hash",
    length: 128,
    default: () => "'0'",
  })
  passwordHash: string;

  @Column( {
    type: "varchar",
    name: "email",
    length: 128, 
 })
  email: string;
}
