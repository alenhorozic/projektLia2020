import { Controller, Get, Body, Post, UseGuards, Req } from "@nestjs/common";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { Request } from "express";
import { TransaktionService } from "src/services/transaktion/transaktion.service";
import { Transaktion } from "entities/transaktion.entity";
import { AddTransaktionDto } from "src/dtos/transaktion/add.transaktion.dto";
import { ApiRespons } from "src/misc/apirespons.class";


@Controller('api/transaktion')
export class TransaktionController{
    constructor(
        private transaktionService: TransaktionService,
      ){}

      @Get()               //GET    http://localhost:3000/api/transaktion        list all  transaktioner!! 
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles('user')
      async getCurentAccaaunt(@Req() req: Request): Promise<Transaktion[]> {
        const userId = req.token.id;
        return  this.transaktionService.getAllTransaktionUser(userId);
      }
      @Post('')                  //PUT    http://localhost:3000/api/transaktion
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("user")
      add( @Body() data: AddTransaktionDto ): Promise<Transaktion | ApiRespons>{
      return this.transaktionService.add(data);
  }  
}