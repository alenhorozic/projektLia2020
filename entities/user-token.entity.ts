import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import * as Validator from 'class-validator';
  
  @Entity("user_token", { schema: "bank" })
  export class UserToken {
    @PrimaryGeneratedColumn({ type: "int", name: "user_token_id", unsigned: true })
    userTokenId: number;

    @Column({type: "int", name: "user_id", unsigned: true })
    userId: number;
  
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
  