import { Injectable } from "@nestjs/common";
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
}