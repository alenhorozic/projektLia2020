export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;           //VARNING  WITH IMPLEMENT REMOWERHIS ROW

    constructor(id:number,un:string,jwt:string){
        this.id = id;
        this.identity = un;
        this.token = jwt;
    }
}