export class LoginInfoUserDto {
    userId: number;
    email: string;
    phoneNumber: string;
    token: string;

    constructor(id:number,email:string,phone:string,jwt:string){
        this.userId = id;
        this.email = email;
        this.phoneNumber = phone;
        this.token = jwt;
    }
}