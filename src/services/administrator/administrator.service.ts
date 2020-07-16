import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiRespons } from 'src/misc/apirespons.class';
import * as crypto from "crypto";
import { AdministratorToken } from 'entities/administrator-token.entity';


@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator) 
        private readonly administrator: Repository<Administrator>,
        @InjectRepository(AdministratorToken) 
        private readonly administratorToken: Repository<AdministratorToken>,
    ) { }
    getAll(): Promise<Administrator[]> {
        return this.administrator.find();
    }
    async getByUsername(username: string): Promise< Administrator | null> { 
        const admin = await this.administrator.findOne({
            username: username
        });
        if (admin){
            return admin;
        }
        return null;
    }
    getById(id:number): Promise<Administrator> {
        return this.administrator.findOne(id);
    }
    add(data: AddAdministratorDto): Promise<Administrator | ApiRespons> {
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;
        newAdmin.email = data.email;

        return new Promise((resolve) =>{
            this.administrator.save(newAdmin)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong  username All Ready Exist");
                resolve(response);
            });
        });
        
    }
        async editById(id: number,data: EditAdministratorDto): Promise<Administrator | ApiRespons> {
        let admin: Administrator = await this.administrator.findOne(id);

        if(admin === undefined) {
            return new Promise((resolve) => {
                resolve(new ApiRespons("error", -1003,"Administrator Not Find"));
            });
        }
        
        if(data.email && data.password){
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;
        admin.email = data.email;
        return this.administrator.save(admin);
        }

        if(data.email){
            admin.email = data.email;
        return this.administrator.save(admin)
        }

        if(data.password){
            const crypto = require('crypto'); 
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;
        return this.administrator.save(admin);
        }

    }
    async addToken(administratorId: number, token: string, expiresAt: string) {
        const administratorToken = new AdministratorToken();
        administratorToken.administratorId = administratorId;
        administratorToken.token = token;
        administratorToken.expiresAt = expiresAt;

        return await this.administratorToken.save(administratorToken);
    }

    async getAdministratorToken(token: string): Promise<AdministratorToken> {
        return await this.administratorToken.findOne({
            token: token,
        });
    }

    async invalidateToken(token: string): Promise<AdministratorToken | ApiRespons> {
        const administratorToken = await this.administratorToken.findOne({
            token: token,
        });

        if(!administratorToken) {
            return new ApiRespons("error",-10001,"No Such Refresh Token")
        }
        
        administratorToken.isvalid = 0;

        await this.administratorToken.save(administratorToken);

        return await this.getAdministratorToken(token);
    }

    async invalidateAdministratorTokens(administratorId: number): Promise<(AdministratorToken | ApiRespons)[]> {
        const administratorTokens = await this.administratorToken.find({
            administratorId: administratorId,
        });

        const results = [];

        for (const administratorToken of administratorTokens) {
            results.push(this.invalidateToken(administratorToken.token));
        }
        return results;
    }
}
