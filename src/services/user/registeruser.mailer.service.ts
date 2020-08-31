import { Injectable } from "@nestjs/common";
import { User } from "entities/user.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { MailConfig } from "config/mail.config";

@Injectable()
export class RegisterUserMailer {
    constructor(private readonly mailerService: MailerService) { }
    async sendRegisterUserEmail(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            bcc: MailConfig.userNotificationMail,
            subject:'Welcome New User',
            encoding: 'UTF-8',
            replyTo: 'no-replay.@e-bank.com',
            html: this.userHtml(user),
        });
    }
    userHtml(user: User): string {
        return `
        <h1>Welcomen As New Customer</h1>
        <p>Detald Of Yours Information</p>
        <p>
        <p> UserID: ${user.userId}.</p>
        <p> Forname: ${user.forname}.</p>
        <p> Surname: ${user.surname}.</p>
        <p> email: ${user.email}.</p>
        <p> password: [hidden].</p>
        <p> phoneNumber: ${user.phoneNumber}.</p>
        </p>`;
    }
}