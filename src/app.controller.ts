import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {

  @Get()              //   http://localhost:3000    
  getHello(): string {
    return 'Hello Lia!!';
  }
  @Get('world')       //  http://localhost:3000/world
  getWorld(): string {
    return 'Hello World!!!!!';
  }
}
