import { Controller, Post, Body, Req, } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiRespons } from "src/misc/apirespons.class";
import * as crypto from "crypto";
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto"
import * as jwt from 'jsonwebtoken';
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { Request } from "express";
import { jwtsecret } from "config/jwt.secret";

@Controller('auth')
export class AuthController {
    constructor(public administratorService: AdministratorService) {}

    @Post('login')   //   http://localhost:3000/auth/login/
    async doLogin(@Body() data: LoginAdministratorDto,@Req() req:Request): Promise<LoginInfoAdministratorDto | ApiRespons> {
        const administrator = await this.administratorService.getByUsername(data.username);

        if (!administrator) {
            return new Promise(resolve => resolve(new ApiRespons('errpr',-3005,'Wrong Username')));
        }

        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // username => username        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (administrator.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiRespons('errpr',-3006,'Wrong Pasword')));
        }

        const jwtData = new JwtDataAdministratorDto();
        jwtData.administratorId = administrator.administratorId;
        jwtData.username = administrator.username;

        let justNow = new Date();
        justNow.setDate(justNow.getDate() + 14);
        const expeirTimestamp = justNow.getDate() / 1000;
        jwtData.ext = expeirTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoAdministratorDto(
            administrator.administratorId,
            administrator.username,
            token
        );

        return new Promise(resolve => resolve(responseObject));
    }  
}