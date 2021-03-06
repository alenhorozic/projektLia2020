import { Controller, Get, Param, Put, Body, Post, SetMetadata, UseGuards, Patch, Req } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiRespons } from "src/misc/apirespons.class";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { User } from "entities/user.entity";
import { UserService } from "src/services/user/user.service";
import { RegisterUserMailer } from "src/services/user/registeruser.mailer.service";
import { Request } from "express";

@Controller('api/administrator')
export class AdministratorControler{
    constructor(
        private administratorService: AdministratorService,
        private userService: UserService,
        private registerUserMailer: RegisterUserMailer,
      ){}

    @Get()               //GET    http://localhost:3000/api/administrator        list all  administrator!! 
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    getAll(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get('administrator')               //GET    http://localhost:3000/api/administrator/administrator       list administrator from administrator login (token)!! 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles("administrator")
  async getCurentAdministrator(@Req() req: Request): Promise<Administrator[]> {
      const administratorId = req.token.id;
  return  this.administratorService.getAdminWhitToken(administratorId);
}


  @Get(':id')               //GET    http://localhost:3000/api/administrator/4/  
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator') 
    getById(@Param('id') administratorId: number): Promise<Administrator | ApiRespons> {
      return new Promise(async (resolve) =>{
        let adnin = await this.administratorService.getById(administratorId);
        if(adnin === undefined){
          resolve(new ApiRespons("error", -1003,"Administrator Not Find"));
        }
        resolve(adnin);
      });
  }
  @Put('registeradministrator')                  //PUT    http://localhost:3000/api/administrator/registeradministrator
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  add( @Body() data: AddAdministratorDto ): Promise<Administrator | ApiRespons>{
      return this.administratorService.add(data);
  }  
  @Post(':id')                //POST    http://localhost:3000/api/administrator/4/ 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  edit(@Param('id') id: number, @Body() data: EditAdministratorDto):Promise<Administrator | ApiRespons>{
      return this.administratorService.editById(id, data);
  }
  @Put('registeruser')        //PUT  REGISTER NEW USER    http://localhost:3000/api/administrator/registeruser 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  async registeruser( @Body() data: AddUserDto ): Promise<User | ApiRespons>{
      const user = await this.userService.add(data);

      if(user instanceof ApiRespons) {
        return user;
      }

     await this.registerUserMailer.sendRegisterUserEmail(user)

      return user;
  }  
}