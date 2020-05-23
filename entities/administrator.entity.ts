import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn({
      type: "int",
      name: "administrator_id",
      unsigned: true,
    })
    administratorId: number;

    @Column({
        type: "varchar", 
        name: "username",
        unique: true,
        length: 64,
      })
      username: string;

    @Column({
        type: "varchar", 
        name: "password_hash",
        length: 128,
      })
      passwordHash: string;

    @Column({
        type: "varchar", 
        name: "email",
        length: 128,
        })
      email: string;
    
}