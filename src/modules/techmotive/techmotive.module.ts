import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Addresses } from '../../models/addresses.model';
import { Clients } from '../../models/clients.model';
import { ClientsController } from './clients/clients.controller';
import { ClientsService } from './clients/clients.service';

@Module({
  imports: [SequelizeModule.forFeature([Clients, Addresses])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class TechmotiveModule {}
