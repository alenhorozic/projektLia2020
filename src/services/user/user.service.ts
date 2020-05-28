import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import * as crypto from "crypto";
import { ApiRespons } from 'src/misc/apirespons.class';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly user: Repository<User>,
    ) { }
    getAll(): Promise<User[]> {
        return this.user.find();
    }
    async getByEmail(email: string): Promise< User | null> { 
        const user = await this.user.findOne({
            email : email
        });
        if (user){
            return user;
        }
        return null;
    }
    getById(id:number): Promise<User> {
        return this.user.findOne(id);
    }
    add(data: AddUserDto): Promise<User | ApiRespons> {
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newUser: User = new User();
        newUser.email = data.email;
        newUser.passwordHash = passwordHashString;
        newUser.forname = data.forname;
        newUser.surname = data.surname;
        newUser.phoneNumber = data.phoneNumber
        

        return new Promise((resolve) =>{
            this.user.save(newUser)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong user Whit Same email Or phoneNumber All Redy Exist");
                resolve(response);
            });
        });
        
    }
        async editById(id: number,data: EditUserDto): Promise<User | ApiRespons>  {
        let user: User = await this.user.findOne(id);

        if(user === undefined) {
            return new Promise((resolve) => {
                resolve(new ApiRespons("error", -1002,"User Not Find"));
            });
        }
        
        if(data.phoneNumber && data.password){
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.passwordHash = passwordHashString;
        user.phoneNumber = data.phoneNumber;
        return this.user.save(user);
        }

        if(data.phoneNumber){
            user.phoneNumber = data.phoneNumber;

        return this.user.save(user)
        }

        if(data.password){
            const crypto = require('crypto'); 
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.passwordHash = passwordHashString;
        return this.user.save(user);
        }

    }
}