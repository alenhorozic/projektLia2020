import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommingTransaktion } from "entities/commingTransaktion.entity";

@Injectable()
export class CommingTransaktionService extends TypeOrmCrudService<CommingTransaktion> {           ///!!! ADD IN  APP.MODUL.TS
    constructor(@InjectRepository(CommingTransaktion) private readonly commingTransaktion: Repository<CommingTransaktion>) {
        super(commingTransaktion);
    }
}