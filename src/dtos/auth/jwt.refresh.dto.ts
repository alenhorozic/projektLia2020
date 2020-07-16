export class JwtRefreshDataDto {
    role:"administrator" | "user";
    id: number;
    identity: string;
    ext: number; // unix taimstamp
    ip:string;
    ua:string;

    toPlainObject() {
        return{
            role: this.role,
            id: this.id,
            identity: this.identity,
            ext: this.ext,
            ip: this.ip,
            ua: this.ua
        }
    }

}