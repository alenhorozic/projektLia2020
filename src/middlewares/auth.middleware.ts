import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtsecret } from "config/jwt.secret";
import { UserService } from "src/services/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        public administratorService: AdministratorService,
        public userService: UserService,
        ) { }

    async use(req: Request, res: Response, next: NextFunction) {
      if( !req.headers.authorization) {
          throw new HttpException('Token not Faund', HttpStatus.UNAUTHORIZED);
      }

      const token = req.headers.authorization;

      const tokenParts = token.split(' ');
      if(tokenParts.length !== 2){
        throw new HttpException('Bad Token', HttpStatus.UNAUTHORIZED);
      }

      const tokenString = tokenParts[1];

      const jwtData: JwtDataDto = jwt.verify(tokenString, jwtsecret)

      if( !jwtData) {
        throw new HttpException('Bad Token', HttpStatus.UNAUTHORIZED);
    }

    const ip = req.ip.toString();

    if(jwtData.ip !== ip) {
        throw new HttpException('Bad Token', HttpStatus.UNAUTHORIZED);
    }

    if(jwtData.ua !== req.headers['user-agent']) {
        throw new HttpException('Bad Token', HttpStatus.UNAUTHORIZED);
    }

    if(jwtData.role === "administrator"){
        const administrator = await this.administratorService.getById(jwtData.id);
        if(!administrator){
            throw new HttpException('Administrator Not Found', HttpStatus.UNAUTHORIZED);
        }
    }if(jwtData.role === "user"){
        const user = await this.userService.getById(jwtData.id);
        if(!user){
            throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
        }
    }


    let justNowTimestamp = new Date().getTime() / 1000;

    if(justNowTimestamp <= jwtData.ext){
        throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
    }

    req.token = jwtData


        next();
    }
}

