
import { Controller, Get, Param, Put, Body, Post, SetMetadata, UseGuards, Req } from "@nestjs/common";
import { AccauntService } from "src/services/accaunt/accaunt.service";
import { Accaunt } from "entities/accaunt.entity";
import { AddAccauntDto } from "src/dtos/accaunt/add.accaunt.dto";
import { EditAccauntDto } from "src/dtos/accaunt/edit.accaunt.dto";
import { ApiRespons } from "src/misc/apirespons.class";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { Request } from "express";


@Controller('api/accaunt')
export class AccauntControler{
    constructor(
        private accauntService: AccauntService,
      ){}

      @Get()               //GET    http://localhost:3000/api/accaunt        list all  accaunt!! 
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles('administrator')
      getAll(): Promise<Accaunt[]> {
      return this.accauntService.getAll();
      }

    @Get('user')               //GET    http://localhost:3000/api/accaunt/user       list all  accaunt from user login (token)!! 
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    async getCurentAccaaunt(@Req() req: Request): Promise<Accaunt[]> {
        const userId = req.token.id;
    return  this.accauntService.getAllAccauntUser(userId);
  }
  @Get(':id')               //GET    http://localhost:3000/api/accaunt/4/  
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles("administrator") 
    getById(@Param('id') accauntId: number): Promise<Accaunt | ApiRespons> {
      return new Promise(async (resolve) =>{
        let user = await this.accauntService.getById(accauntId);
        if(user === undefined){
          resolve(new ApiRespons("error", -1003,"Accaunt Not Find"));
        }
        resolve(user);
      });
  }
  @Put('registeraccaunt')                  //PUT    http://localhost:3000/api/accaunt/registeraccaunt
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles("administrator","user")
  add( @Body() data: AddAccauntDto ): Promise<Accaunt | ApiRespons>{
      return this.accauntService.add(data);
  }  
  @Post(':id')                //POST    http://localhost:3000/api/accaunt/4/ 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles("administrator")
  edit(@Param('id') id: number, @Body() data: EditAccauntDto):Promise<Accaunt | ApiRespons>{
      return this.accauntService.editById(id, data);
  }
}