import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Accaunt } from "entities/accaunt.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccauntService extends TypeOrmCrudService<Accaunt> {                           ///!!! EVIDENTERA I APP.MODUL
    constructor(@InjectRepository(Accaunt) private readonly accaunt: Repository<Accaunt>) {
        super(accaunt);
    }
}