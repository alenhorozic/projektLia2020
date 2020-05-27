import { Module } from '@nestjs/common';
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


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: DatabaseConfiguration.hostname,
      port:3306,
      username:DatabaseConfiguration.username,
      password:DatabaseConfiguration.password,
      database:DatabaseConfiguration.database,
      entities: [ Administrator,
        Accaunt,
        CommingTransaktion,
        Transaktion,
        TransaktionType,
        User
       ]
    }),
    TypeOrmModule.forFeature([ Administrator, User, Accaunt, Transaktion, CommingTransaktion ])
  ],
  controllers: [
    AppController,
    AdministratorControler,
    UserControler,
    AccauntControler,
    TransaktionController,
    CommingTransaktionController,
    AuthController
  ],
  providers: [AdministratorService, UserService, AccauntService, TransaktionService, CommingTransaktionService],
})
export class AppModule {}
