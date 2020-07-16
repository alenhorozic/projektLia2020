export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;           //VARNING  WITH IMPLEMENT REMOWERHIS ROW
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id:number,un:string,jwt:string,refreshToken:string,refreshTokenExpiresAt:string){
        this.id = id;
        this.identity = un;
        this.token = jwt;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    }
}