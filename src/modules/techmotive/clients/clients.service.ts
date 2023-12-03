import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Op } from 'sequelize';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { InvalidArgumentsException } from 'src/exceptions/invalid-arguments.exception';

import { Addresses } from '../../../models/addresses.model';
import { Clients } from '../../../models/clients.model';
import { AddressDto } from './dto/address.dto';
import {
  ClientDto,
  GetClientsReqDto,
  SearchClientsReqDto,
  UpdateClientReqDto,
} from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Clients)
    private clientsModel: typeof Clients,
    @InjectModel(Addresses)
    private addressesModel: typeof Addresses,
  ) {}

  async create(client: ClientDto): Promise<ClientDto> {
    const phone = parsePhoneNumber(client.phone, 'RU').number;

    const maybeDublicatePhoneNumber = await this.clientsModel.findOne({
      where: { phone },
    });

    if (maybeDublicatePhoneNumber) {
      throw new InvalidArgumentsException(
        'Такой номер телефона уже используется',
      );
    }

    const createClientResult = await this.clientsModel.create({
      first_name: client.first_name,
      last_name: client.last_name,
      patronymic: client?.patronymic || '',
      phone,
      about_client: client.about_client,
    });

    const createAddressesResult: AddressDto[] = [];

    for (const address of client.addresses) {
      createAddressesResult.push(
        await this.addressesModel.create({
          client_id: createClientResult.id,
          city: address.city,
          address: address.address,
          description: address?.description || null,
        }),
      );
    }

    return {
      ...createClientResult.toJSON(),
      addresses: createAddressesResult,
    };
  }

  async delete(uid: string) {
    const isRemoved = Boolean(
      await this.clientsModel.destroy({
        where: {
          uid,
        },
      }),
    );

    if (!isRemoved) throw new InvalidArgumentsException('Клиент не найден');
  }

  async update(uid: string, data: UpdateClientReqDto): Promise<ClientDto> {
    const client = await this.clientsModel.findByPk(uid);

    if (!client) {
      throw new InvalidArgumentsException('Клиент не найден');
    }

    if (data.phone) {
      const maybeDublicatePhoneNumber = await this.clientsModel.findOne({
        where: { phone: data.phone },
      });

      if (maybeDublicatePhoneNumber) {
        throw new InvalidArgumentsException(
          'Такой номер телефона уже используется',
        );
      }
    }

    return client.update(data);
  }

  async findAll(
    searchAttributes?: SearchClientsReqDto,
    pageOptions?: PageOptionsDto,
  ): Promise<GetClientsReqDto> {
    const values = {};

    if (searchAttributes?.phone) {
      searchAttributes.phone = parsePhoneNumber(
        searchAttributes.phone,
        'RU',
      ).number;
    }

    Object.keys(searchAttributes).forEach((key) => {
      values[key] = { [Op.like]: `%${searchAttributes[key]}%` };
    });

    const clients = await this.clientsModel.findAndCountAll({
      where: values,
      order: [['create_dt', pageOptions.order]],
      include: {
        model: Addresses,
        as: 'addresses',
      },
      limit: pageOptions.limit,
      offset: pageOptions.offset,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptions,
      itemCount: clients.count,
    });

    return { data: clients.rows, meta: pageMetaDto };
  }

  async findById(id: string): Promise<ClientDto> {
    return this.clientsModel.findByPk(id, {
      include: {
        model: Addresses,
        as: 'addresses',
      },
    });
  }

  async findByPhone(phone: string): Promise<ClientDto> {
    const parsedPhone = parsePhoneNumber(phone, 'RU').number;

    return this.clientsModel.findOne({
      where: { phone: parsedPhone },
      include: {
        model: Addresses,
        as: 'addresses',
      },
    });
  }
}
