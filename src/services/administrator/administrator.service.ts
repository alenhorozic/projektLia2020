import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import * as crypto from "crypto";
import { ApiRespons } from 'src/misc/apirespons.class';


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
        const crypto = require('crypto'); 
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
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong");
                resolve(response);
            });
        });
        
    }
        async editById(id: number,data: EditAdministratorDto): Promise<Administrator> {
        let admin: Administrator = await this.administrator.findOne(id);
        
        const crypto = require('crypto'); 
        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        
        admin.passwordHash = passwordHashString;
        admin.email = data.email;

        return this.administrator.save(admin);

    }
}
//add
//editById
