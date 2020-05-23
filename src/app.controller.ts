import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';


@Controller()
export class AppController {
  constructor(
    private administratorService: AdministratorService
  ){}

  @Get()              //   http://localhost:3000        ispisace Home Page!! 
  getIndex(): string {
    return 'Home Page!!';
  }

  @Get('api/administrator')               //    http://localhost:3000/api/administrator       ispisace listu administratora!! 
  getAllAdmins(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get('api/admin')
  getAdmin(): Promise<Administrator> {
    return this.administratorService.getById(4);
  }

}
