import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransaktionType } from "entities/transaktionType.entity";

@Injectable()
export class TransaktionTypeService extends TypeOrmCrudService<TransaktionType> {           ///!!! ADD IN  APP.MODUL.TS
    constructor(@InjectRepository(TransaktionType) private readonly transaktionType: Repository<TransaktionType>) {
        super(transaktionType);
    }
}