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
    TypeOrmModule.forFeature([ Administrator ])
  ],
  controllers: [
    AppController,
    AdministratorControler
  ],
  providers: [AdministratorService],
})
export class AppModule {}