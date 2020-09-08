import { Controller, Get, Body, Post, UseGuards, Req, Delete, Param } from "@nestjs/common";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { Request } from "express";
import { ApiRespons } from "src/misc/apirespons.class";
import { CommingTransaktionService } from "src/services/commingTransaktion/commingTransaktion.service";
import { AddCommingTransaktionDto } from "src/dtos/commingTransaktion/add.commingTransaktion.dto";
import { CommingTransaktion } from "entities/commingTransaktion.entity";


@Controller('api/commingTransaktion')
export class CommingTransaktionController{
    constructor(
    private commingTransaktionService: CommingTransaktionService,
    ){}

    @Get()               //GET    http://localhost:3000/api/commingTransaktion        list all  transaktioner!! 
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async getCurentAccaaunt(@Req() req: Request): Promise<CommingTransaktion[]> {
    const userId = req.token.id;
    return  this.commingTransaktionService.getAllTransaktionUser(userId);
    }

    @Post('')                  //POST    http://localhost:3000/api/commingTransaktion
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    add( @Body() data: AddCommingTransaktionDto ): Promise<CommingTransaktion | ApiRespons>{
    return this.commingTransaktionService.add(data);
    }
    @Delete(':commingTransaktionId')                  //POST    http://localhost:3000/api/commingTransaktion/id
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    public async deleteCommingTransaktion(@Param('commingTransaktionId') commingTransaktionId: number){
        await this.commingTransaktionService.commingTransaktion.findOne({
            commingTransaktionId:commingTransaktionId
        });
        const deliteResult = await this.commingTransaktionService.deliteById(commingTransaktionId);
        if(deliteResult.affected === 0){
            return new ApiRespons('error',-4444,'Comming transaktion Not Found')
        }
        return new ApiRespons('ok',0,'Delete Complited')
    }
}