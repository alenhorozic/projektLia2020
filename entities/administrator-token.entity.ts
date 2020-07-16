import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import * as Validator from 'class-validator';
  
  @Entity("administrator_token", { schema: "bank" })
  export class AdministratorToken {
    @PrimaryGeneratedColumn({ type: "int", name: "administrator_token_id", unsigned: true })
    administratorTokenId: number;

    @Column({type: "int", name: "administrator_id", unsigned: true })
    administratorId: number;
  
    @Column("timestamp", {
      name: "crated_at",
      default: () => "CURRENT_TIMESTAMP",
    })
    cratedAt: string;
  
    @Column({ type: "text" })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string;

    @Column("datetime", {
        name: "expires_at",
      })
      expiresAt: string;
    
    @Column("tinyint", { name: "is_valid", unsigned: true , default: 1})
    @Validator.IsNotEmpty()
    @Validator.IsIn([1,2])
    isvalid: number;
  
  }