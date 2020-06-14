import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accaunt } from 'entities/accaunt.entity';
import { Repository } from 'typeorm';
import { AddAccauntDto } from 'src/dtos/accaunt/add.accaunt.dto';
import { EditAccauntDto } from 'src/dtos/accaunt/edit.accaunt.dto';
import { ApiRespons } from 'src/misc/apirespons.class';



@Injectable()
export class AccauntService {
    constructor(
        @InjectRepository(Accaunt) 
        private readonly accaunt: Repository<Accaunt>,
    ) { }
    getAll(): Promise<Accaunt[]> {
        return this.accaunt.find({
            relations:[
                "user",
                "transaktions",
                "transaktions.transaktionType",
                "commingTransaktions"
            ]
        });
    }
    async getAllAccauntUser(userId: number): Promise<Accaunt[] | null> {
        const accaunt = await this.accaunt.find({
            where: {
                userId: userId,
            },
            relations: [
                "user",
                "transaktions",
                "transaktions.transaktionType",
                "commingTransaktions"
            ]
        });
        if(!accaunt || accaunt.length === 0) {
            return null;
        }
        return accaunt;
    }
    getById(id:number): Promise<Accaunt> {
        return this.accaunt.findOne(id,{
             relations:[
                    "user",
                    "transaktions",
                    "transaktions.transaktionType",
                    "commingTransaktions"
            ] 
        });
    }
    add(data: AddAccauntDto): Promise<Accaunt | ApiRespons> {
        
        let newAccaunt: Accaunt = new Accaunt();
        newAccaunt.accauntNumber = data.accauntNumber;
        newAccaunt.userId = data.userId;
        newAccaunt.isActiv = data.isActiv;
        newAccaunt.accauntName = data.accauntName;

        return new Promise((resolve) =>{
            this.accaunt.save(newAccaunt)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiRespons = new ApiRespons("error",-1001,"Not Is Wrong AccauntNumber All Ready Exist");
                resolve(response);
            });
        });
        
    }
        async editById(Id: number,data: EditAccauntDto): Promise<Accaunt | ApiRespons> {
        let accaunt: Accaunt = await this.accaunt.findOne(Id);

        if(accaunt === undefined) {
            return new Promise((resolve) => {
                resolve(new ApiRespons("error", -1003,"accaunt not find"));
            });
        }
        if(data.isActiv && data.accauntName) {
            accaunt.isActiv = data.isActiv;
            accaunt.accauntName = data.accauntName;
            return this.accaunt.save(accaunt);
        }
        if(data.accauntName) {
            accaunt.accauntName = data.accauntName;
            return this.accaunt.save(accaunt);
        }
        if(data.isActiv) {
            accaunt.isActiv = data.isActiv;
            return this.accaunt.save(accaunt);
        }   
    }  
}

