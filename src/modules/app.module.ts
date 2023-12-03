import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfig from '../config/database.config';
import { TechmotiveModule } from './techmotive/techmotive.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.schema'),
        synchronize: true,
        logging: true,
        autoLoadModels: true,
        models: [],
      }),
    }),

    TechmotiveModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
