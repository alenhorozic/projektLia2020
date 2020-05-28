import { Controller, Post, Body, Req, } from "@nestjs/common";
import { ApiRespons } from "src/misc/apirespons.class";
import * as crypto from "crypto";
import * as jwt from 'jsonwebtoken';
import { Request } from "express";
import { jwtsecret } from "config/jwt.secret";
import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { LoginInfoUserDto } from "src/dtos/user/login.info.user.dto";
import { JwtDataUserDto } from "src/dtos/user/jwt.data.user.dto";

@Controller('authUser')
export class AuthUserController {
    constructor(public userService: UserService) {}

    @Post('login')   //   http://localhost:3000/authUser/login/
    async doLogin(@Body() data: LoginUserDto,@Req() req:Request): Promise<LoginInfoUserDto | ApiRespons> {
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

        const jwtData = new JwtDataUserDto();
        jwtData.userId = user.userId;
        jwtData.email = user.email;

        let justNow = new Date();
        justNow.setDate(justNow.getDate() + 14);
        const expeirTimestamp = justNow.getDate() / 1000;
        jwtData.ext = expeirTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoUserDto(
            user.userId,
            user.email,
            user.phoneNumber,
            token
        );

        return new Promise(resolve => resolve(responseObject));
    }  
}