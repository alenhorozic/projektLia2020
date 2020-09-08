import { Controller, Get, Param, Put, Body, Post, UseGuards, Req } from "@nestjs/common";
import { ApiRespons } from "src/misc/apirespons.class";
import { UserService } from "src/services/user/user.service";
import { User } from "entities/user.entity";
import { EditUserDto } from "src/dtos/user/edit.user.dto";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { Request } from "express";

@Controller('api/user')
export class UserControler{
    constructor(
        private userService: UserService
      ){}

  @Get()               //GET    http://localhost:3000/api/user        list all  user!! 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
    getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('user')               //GET    http://localhost:3000/api/user/user       list user from user login (token)!! 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles("user")
  async getCurentUser(@Req() req: Request): Promise<User[]> {
      const userId = req.token.id;
  return  this.userService.getUserWhitToken(userId);
  }

  @Get(':id')               //GET    http://localhost:3000/api/user/2/ 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator','user')         
  getById(@Param('id') userId: number): Promise<User | ApiRespons> {
    return new Promise(async (resolve) =>{
      let user = await this.userService.getById(userId);
      if(user === undefined){
        resolve(new ApiRespons("error", -1004,"User Not Find"));
      }
      resolve(user);
    });
}
/*  @Put('')                  //PUT    http://localhost:3000/api/user  
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')                                          // "Only administrator can create new user"
  add( @Body() data: AddUserDto ): Promise<User | ApiRespons>{           //  http://localhost:3000/api/administrator/registeruser
      return this.userService.add(data);                                //      using administrator.controller
  }  */
  @Post(':id')                //POST    http://localhost:3000/api/user/2/ 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator','user')
  edit(@Param('id') id: number, @Body() data: EditUserDto):Promise<User | ApiRespons>{
      return this.userService.editById(id, data);
    }

}