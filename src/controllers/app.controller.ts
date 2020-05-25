import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from '../services/administrator/administrator.service';
import { User } from 'entities/user.entity';
import { UserService } from 'src/services/user/user.service';


@Controller()
export class AppController {
  constructor(
    private administratorService: AdministratorService,
    private userService: UserService
  ){}

  @Get()              //   http://localhost:3000        ispisace Home Page!! 
  getIndex(): string {
    return 'Home Page!!';
  }

  @Get('api/admin')
  getAdmin(): Promise<Administrator> {
    return this.administratorService.getById(4);
  }

  @Get('api/userhome')
  getUser(): Promise<User> {
    return this.userService.getById(2);
  }

}
