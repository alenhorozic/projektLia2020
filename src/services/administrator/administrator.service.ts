import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';


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
    add(data: AddAdministratorDto) {
        const crypto = require('crypto'); 
        const passwordHash = crypto.createHash('sah512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').topUpperCase();

        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;
        newAdmin.email =data.email;

        return this.administrator.save(newAdmin);
    }
        async editById(id: number,data: EditAdministratorDto): Promise<Administrator> {
        let admin: Administrator = await this.administrator.findOne(id);
        
        const crypto = require('crypto'); 
        const passwordHash = crypto.createHash('sah512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').topUpperCase();

        admin.passwordHash = passwordHashString;

        return this.administrator.save(admin);

    }
}
//add
//editById
//delete/byId