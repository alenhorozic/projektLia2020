import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommingTransaktion } from "entities/commingTransaktion.entity";
import { ApiRespons } from 'src/misc/apirespons.class';
import { AddCommingTransaktionDto } from 'src/dtos/commingTransaktion/add.commingTransaktion.dto';

@Injectable()
export class CommingTransaktionService  {
    findOne(arg0: { commingTransaktionId: number; }) {
        throw new Error("Method not implemented.");
    }           ///!!! ADD IN  APP.MODUL.TS
    constructor(
        @InjectRepository(CommingTransaktion)
     public readonly commingTransaktion: Repository<CommingTransaktion>
     ) {}

     getAll(): Promise<CommingTransaktion[]> {
        return this.commingTransaktion.find({
            relations:[
                "user",
                "accaunt",
                "accaunt.user",
            ]
        });
    }
    async getAllTransaktionUser(userId: number): Promise<CommingTransaktion[] | null> {
        const commingTransaktion = await this.commingTransaktion.find({
            where: {
                userId: userId,
                // accauntId:8
                // isActiv: 1,   show only activ accaunt
            },
            relations: [
                "user",
                "accaunt",
                "accaunt.user",
            ]
        });
        if(!commingTransaktion || commingTransaktion.length === 0) {
            return null;
        }
        return commingTransaktion;
    }
    getById(id:number): Promise<CommingTransaktion> {
        return this.commingTransaktion.findOne(id,{
             relations:[
                    "user",
                    "accaunt",
                    "accaunt.user",
            ] 
        });
    }
    add(data: AddCommingTransaktionDto): Promise<CommingTransaktion | ApiRespons> {
        let newCommingTransaktion: CommingTransaktion = new CommingTransaktion();
        newCommingTransaktion.accauntId = data.accauntId;
        newCommingTransaktion.amount = data.amount;
        newCommingTransaktion.transaktionAt = data.transaktionAt;
        newCommingTransaktion.transaktionToAccauntNumber = data.transaktionToAccauntNumber;
        newCommingTransaktion.status = data.status;
        newCommingTransaktion.userId = data.userId;
        

        return new Promise((resolve) =>{
            this.commingTransaktion.save(newCommingTransaktion)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong");
                resolve(response);
            });
        });
    }
    async deliteById(id:number){
        return await this.commingTransaktion.delete(id);
    }
}

    
