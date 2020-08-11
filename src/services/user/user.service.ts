import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import * as crypto from "crypto";
import { ApiRespons } from 'src/misc/apirespons.class';
import { UserToken } from 'entities/user-token.entity';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly user: Repository<User>,
        @InjectRepository(UserToken) 
        private readonly userToken: Repository<UserToken>,
    ) { }
    getAll(): Promise<User[]> {
        return this.user.find({
            relations:[
                "accaunts",
                "accaunts.transaktions",
                "accaunts.commingTransaktions",
            ]
        });
    }
    async getByEmail(email: string): Promise< User | null> { 
        const user = await this.user.findOne({
            where:{
                 email : email,
            },
            relations:[
                "accaunts",
                "accaunts.transaktions",
                "accaunts.commingTransaktions",
            ]
        });
        if (user){
            return user;
        }
        return null;
    }
    getById(id:number): Promise<User> {
        return this.user.findOne(id,{
            relations:[
                "accaunts",
                "accaunts.transaktions",
                "accaunts.commingTransaktions",
            ]
        });
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
    async addToken(userId: number, token: string, expiresAt: string) {
        const userToken = new UserToken();
        userToken.userId = userId;
        userToken.token = token;
        userToken.expiresAt = expiresAt;

        return await this.userToken.save(userToken);
    }

    async getUserToken(token: string): Promise<UserToken> {
        return await this.userToken.findOne({
            token: token,
        });
    }

    async invalidateToken(token: string): Promise<UserToken | ApiRespons> {
        const userToken = await this.userToken.findOne({
            token: token,
        });

        if(!userToken) {
            return new ApiRespons("error",-10001,"No Such Refresh Token")
        }
        
        userToken.isvalid = 0;

        await this.userToken.save(userToken);

        return await this.getUserToken(token);
    }

    async invalidateUserTokens(userId: number): Promise<(UserToken | ApiRespons)[]> {
        const userTokens = await this.userToken.find({
            userId: userId,
        });

        const results = [];

        for (const userToken of userTokens) {
            results.push(this.invalidateToken(userToken.token));
        }
        return results;
    }
    async getUserWhitToken(userId: number): Promise<User[] | null> {
        const user = await this.user.find({
            where: {
                userId: userId,
            },
        });
        if(!user || user.length === 0) {
            return null;
        }
        return user;
    }
}