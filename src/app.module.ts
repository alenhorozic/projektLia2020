import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { Accaunt } from 'entities/accaunt.entity';
import { CommingTransaktion } from 'entities/commingTransaktion.entity';
import { Transaktion } from 'entities/transaktion.entity';
import { TransaktionType } from 'entities/transaktionType.entity';
import { User } from 'entities/user.entity';
import { AdministratorControler } from './controllers/api/administrator.controller';
import { UserControler } from './controllers/api/user.controller';
import { UserService } from './services/user/user.service';
import { AccauntControler } from './controllers/api/accaunt.controller';
import { AccauntService } from './services/accaunt/accaunt.service';
import { TransaktionService } from './services/transaktion/transaktion.service';
import { TransaktionController } from './controllers/api/transaktion.controller';
import { CommingTransaktionService } from './services/commingTransaktion/commingTransaktion.service';
import { CommingTransaktionController } from './controllers/api/commingTransaktion.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { TransaktionTypeController } from './controllers/api/transaktionType.controller';
import { TransaktionTypeService } from './services/transaktionType/transaktionType.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from 'config/mail.config';
import { RegisterUserMailer } from './services/user/registeruser.mailer.service';
import { UserToken } from 'entities/user-token.entity';
import { AdministratorToken } from 'entities/administrator-token.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: DatabaseConfiguration.hostname,
      port:3306,
      username:DatabaseConfiguration.username,
      password:DatabaseConfiguration.password,
      database:DatabaseConfiguration.database,
      entities: [ 
        Administrator,
        Accaunt,
        CommingTransaktion,
        Transaktion,
        TransaktionType,
        User,
        UserToken,
        AdministratorToken
       ]
    }),
    TypeOrmModule.forFeature([ 
      Administrator, 
      User, 
      Accaunt, 
      Transaktion, 
      CommingTransaktion, 
      TransaktionType,
      UserToken,
      AdministratorToken
    ]),
    MailerModule.forRoot({
      transport:'smtps://' +
       MailConfig.username + ':' +
       MailConfig.password + '@' +
       MailConfig.hostname,
       defaults: {
         from: MailConfig.senderEmail,
       },
    }),
  ],
  controllers: [
    AppController,
    AdministratorControler,
    UserControler,
    AccauntControler,
    TransaktionController,
    CommingTransaktionController,
    AuthController,
    TransaktionTypeController
  ],
  providers: [AdministratorService, UserService, AccauntService, TransaktionService, CommingTransaktionService, TransaktionTypeService, RegisterUserMailer],
  exports:[
    AdministratorService,UserService,AccauntService,TransaktionService, CommingTransaktionService
  ]
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .forRoutes('api/*');
  }
}
