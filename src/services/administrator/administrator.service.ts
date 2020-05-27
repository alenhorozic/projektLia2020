import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiRespons } from 'src/misc/apirespons.class';
import * as crypto from "crypto";



@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator) 
        private readonly administrator: Repository<Administrator>,
    ) { }
    getAll(): Promise<Administrator[]> {
        return this.administrator.find();
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
}
//add
//editById
