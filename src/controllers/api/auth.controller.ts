import { Controller, Post, Body, Req, } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiRespons } from "src/misc/apirespons.class";
import * as crypto from "crypto";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto"
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtsecret } from "config/jwt.secret";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { UserService } from "src/services/user/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
        public userService: UserService
        ) {}

    @Post('administrator/login')   //   http://localhost:3000/auth/administrator/login/
    async doAdministratorLogin(@Body() data: LoginAdministratorDto,@Req() req:Request): Promise<LoginInfoDto | ApiRespons> {
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

        const jwtData = new JwtDataDto();
        jwtData.role = "administrator",
        jwtData.id = administrator.administratorId;
        jwtData.identity = administrator.username;

        let justNow = new Date();
        justNow.setDate(justNow.getDate() + 14);
        const expeirTimestamp = justNow.getDate() / 1000;
        jwtData.ext = expeirTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token
        );

        return new Promise(resolve => resolve(responseObject));
    }  
    @Post('user/login')   //   http://localhost:3000/auth/user/login/
    async doUserLogin(@Body() data: LoginUserDto,@Req() req:Request): Promise<LoginInfoDto | ApiRespons> {
        const user = await this.userService.getByEmail(data.email);

        if (!user) {
            return new Promise(resolve => resolve(new ApiRespons('errpr',-3007,'Wrong Email')));
        }

        const passwordHash = crypto.createHash('sha512');           // DTO => model
        passwordHash.update(data.password);                         // email => email        // password [-] =>passwordHash                                                             
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (user.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiRespons('errpr',-3008,'Wrong Pasword')));
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "user",
        jwtData.id = user.userId;
        jwtData.identity = user.email;

        let justNow = new Date();
        justNow.setDate(justNow.getDate() + 14);
        const expeirTimestamp = justNow.getDate() / 1000;
        jwtData.ext = expeirTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token
        );

        return new Promise(resolve => resolve(responseObject));
    } 
}