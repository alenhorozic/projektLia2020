import { Controller, Get, Param, Put, Body, Post } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiRespons } from "src/misc/apirespons.class";

@Controller('api/administrator')
export class AdministratorControler{
    constructor(
        private administratorService: AdministratorService
      ){}

    @Get()               //GET    http://localhost:3000/api/administrator        list all  administratora!! 
    getAll(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }
  @Get(':id')               //GET    http://localhost:3000/api/administrator/4/             
  getById(@Param('id') administratorId: number): Promise<Administrator> {
    return this.administratorService.getById(administratorId);
  }
  @Put('')                  //PUT    http://localhost:3000/api/administrator  
  add( @Body() data: AddAdministratorDto ): Promise<Administrator | ApiRespons>{
      return this.administratorService.add(data);
  }  
  @Post(':id')                //POST    http://localhost:3000/api/administrator/4/ 
  edit(@Param('id') id: number, @Body() data: EditAdministratorDto):Promise<Administrator>{
      return this.administratorService.editById(id, data);
  }

}