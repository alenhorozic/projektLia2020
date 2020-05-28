export class JwtDataUserDto {
    userId: number;
    email: string;
    ext: number; // unix taimstamp
    ip:string;
    ua:string;

    toPlainObject() {
        return{
            userId: this.userId,
            email: this.email,
            ext: this.ext,
            ip: this.ip,
            ua: this.ua
        }
    }

}