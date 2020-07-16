import { Controller, Post, Body, Req, HttpException, HttpStatus, } from "@nestjs/common";
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
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";
import { UserRefreshTokenDto } from "src/dtos/auth/user.refresh.token.dto";
import { AdministratorRefreshTokenDto } from "src/dtos/auth/administratot.refresh.token.dto";

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
        jwtData.ext = this.getDatePlus(60*5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.ext = this.getDatePlus(60*60*24*31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;
        
        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.ext),
        );
        await this.administratorService.addToken(
            administrator.administratorId,
            refreshToken,
            this.setDatabaseDateFormat(this.getIsoDate(jwtRefreshData.ext))
            );

        return new Promise(resolve => resolve(responseObject));
    }  

    @Post('administrator/refresh')    //    http://localhost:3000/auth/administrator/refresh

    async administratorTokenRefresh(@Req() req: Request, @Body()data: AdministratorRefreshTokenDto): Promise<LoginInfoDto | ApiRespons> {
        const administratorToken = await this.administratorService.getAdministratorToken(data.token);

        if (!administratorToken) {
            return new ApiRespons("error", -10002, "No Such Administrator Refresh Token!");
        }
        if (administratorToken.isvalid === 0){
            return new ApiRespons("error", -10003, "Not Valid Refresh Administrator Token!");
        }

        const sada = new Date();
        const datumIsteka = new Date(administratorToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()){
            return new ApiRespons("error", -10004, "administrator Token Expired! Not Longer Valid!");
        }

        const jwtRefreshData: JwtRefreshDataDto = jwt.verify(data.token, jwtsecret)

        if( !jwtRefreshData) {
        throw new HttpException('Badadministrator  Tokennnnnnn', HttpStatus.UNAUTHORIZED);
        }

        if( jwtRefreshData.ip !== req.ip.toString()) {
        throw new HttpException('Bad administrator Tokennnnnnnnn', HttpStatus.UNAUTHORIZED);
        }

        if( jwtRefreshData.ua !== req.headers["user-agent"]) {
        throw new HttpException('Bad administrator Tokennnnnnnnnnn', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefreshData.role,
        jwtData.id = jwtRefreshData.id;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.ext = this.getDatePlus(60*125);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
        jwtData.id,
        jwtData.identity,
        token,
        data.token,
        this.getIsoDate(jwtRefreshData.ext),
        );
        return responseObject;
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
        jwtData.ext = this.getDatePlus(60*5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.ext = this.getDatePlus(60*60*24*31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;
        
        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.ext),
        );
        await this.userService.addToken(
            user.userId,
            refreshToken,
            this.setDatabaseDateFormat(this.getIsoDate(jwtRefreshData.ext))
            );

        return new Promise(resolve => resolve(responseObject));
    } 
    @Post('user/refresh')    //    http://localhost:3000/auth/user/refresh

    async userTokenRefresh(@Req() req: Request, @Body()data: UserRefreshTokenDto): Promise<LoginInfoDto | ApiRespons> {
        const userToken = await this.userService.getUserToken(data.token);

        if (!userToken) {
            return new ApiRespons("error", -10002, "No Such Refresh Token!");
        }
        if (userToken.isvalid === 0){
            return new ApiRespons("error", -10003, "Not Valid Refresh Token!");
        }

        const sada = new Date();
        const datumIsteka = new Date(userToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()){
            return new ApiRespons("error", -10004, " Token Expired! Not Longer Valid!");
        }

        const jwtRefreshData: JwtRefreshDataDto = jwt.verify(data.token, jwtsecret)

        if( !jwtRefreshData) {
        throw new HttpException('Bad Tokennnnnnn', HttpStatus.UNAUTHORIZED);
        }

        if( jwtRefreshData.ip !== req.ip.toString()) {
        throw new HttpException('Bad Tokennnnnnnnn', HttpStatus.UNAUTHORIZED);
        }

        if( jwtRefreshData.ua !== req.headers["user-agent"]) {
        throw new HttpException('Bad Tokennnnnnnnnnn', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefreshData.role,
        jwtData.id = jwtRefreshData.id;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.ext = this.getDatePlus(60*125);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtsecret);

        const responseObject = new LoginInfoDto(
        jwtData.id,
        jwtData.identity,
        token,
        data.token,
        this.getIsoDate(jwtRefreshData.ext),
        );
        return responseObject;
    }
    private getDatePlus(numberOfSeconds: number): number {
       
        return new Date().getTime() / 1000 + numberOfSeconds;
    }
    private getIsoDate(timestamp: number){
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }
    private setDatabaseDateFormat(isoFormat:string): string{
        return isoFormat.substr(0,19).replace('t',' ');
    }
}