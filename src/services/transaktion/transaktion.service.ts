import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiRespons } from 'src/misc/apirespons.class';
import { Transaktion } from 'entities/transaktion.entity';
import { AddTransaktionDto } from 'src/dtos/transaktion/add.transaktion.dto';



@Injectable()
export class TransaktionService {
    constructor(
        @InjectRepository(Transaktion) 
        private readonly transaktion: Repository<Transaktion>,
    ) { }
    getAll(): Promise<Transaktion[]> {
        return this.transaktion.find({
            relations:[
                "user",
                "accaunt",
                "transaktionType",
            ]
        });
    }
    async getAllTransaktionUser(userId: number): Promise<Transaktion[] | null> {
        const transaktion = await this.transaktion.find({
            where: {
                userId: userId,
                // accauntId:8
                // isActiv: 1,   show only activ accaunt
            },
            relations: [
                "user",
                "accaunt",
                "transaktionType",
            ]
        });
        if(!transaktion || transaktion.length === 0) {
            return null;
        }
        return transaktion;
    }
    getById(id:number): Promise<Transaktion> {
        return this.transaktion.findOne(id,{
             relations:[
                    "user",
                    "accaunt",
                    "transaktionType",
            ] 
        });
    }
    add(data: AddTransaktionDto): Promise<Transaktion | ApiRespons> {
        let newTransaktion: Transaktion = new Transaktion();
        newTransaktion.transaktionTypeId = data.transaktionTypeId;
        newTransaktion.accauntId = data.accauntId;
        newTransaktion.userId = data.userId;
        newTransaktion.amount = data.amount;
        

        return new Promise((resolve) =>{
            this.transaktion.save(newTransaktion)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong");
                resolve(response);
            });
        });
        
    }
}
















































/*import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Transaktion } from "entities/transaktion.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TransaktionService extends TypeOrmCrudService<Transaktion> {
    constructor( @InjectRepository(Transaktion) private readonly transaktion: Repository<Transaktion>  //!!ADD I APP.MODUL.TS
    ){
        super(transaktion);
    }
} */