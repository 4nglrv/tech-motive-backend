import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiDefaultResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Constants } from 'src/common/constants';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { ObjectNotFoundException } from 'src/exceptions/object-not-found.exception';

import { ClientsService } from './clients.service';
import {
  ClientDto,
  ClientSuccessResDto,
  GetClientsReqDto,
  SearchClientsReqDto,
  UpdateClientReqDto,
} from './dto/client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post('create')
  @ApiOperation({
    operationId: 'createClient',
    summary: 'Создание нового клиента',
  })
  @ApiResponse({
    status: 201,
    description: 'Сообщение об успешном создании нового клиента',
    type: ClientSuccessResDto,
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  async create(@Body() createClientDto: ClientDto) {
    return ClientDto.create(await this.clientsService.create(createClientDto));
  }

  @Delete('delete/:uid')
  @ApiOperation({
    operationId: 'deleteClient',
    summary: 'Удаление клиента',
  })
  @ApiParam(
    Constants.ImplicitParams.UUID('uid', 'Уникальный идентификатор клиента'),
  )
  @ApiDefaultResponse({
    status: 200,
    description: 'Клиент успешно удален',
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  @ApiNotFoundResponse(Constants.Response.NotFound)
  async delete(@Param('uid', ParseUUIDPipe) uid: string) {
    await this.clientsService.delete(uid);
  }

  @Put('update/:uid')
  @ApiOperation({
    operationId: 'updateClient',
    summary: 'Обновление данных клиента',
  })
  @ApiParam(
    Constants.ImplicitParams.UUID('uid', 'Уникальный идентификатор клиента'),
  )
  @ApiDefaultResponse({
    status: 201,
    description: 'Сообщение об успешном изменении данных клиента',
    type: ClientSuccessResDto,
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  @ApiNotFoundResponse(Constants.Response.NotFound)
  async update(
    @Param('uid', ParseUUIDPipe) uid: string,
    @Body() data: UpdateClientReqDto,
  ) {
    return ClientDto.update(await this.clientsService.update(uid, data));
  }

  @Get('get')
  @ApiOperation({
    operationId: 'get',
    summary: 'Получить список клиентов',
  })
  @ApiDefaultResponse({
    status: 200,
    description: 'Список клиентов',
    type: GetClientsReqDto,
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  @ApiNotFoundResponse(Constants.Response.NotFound)
  async get(
    @Body() searchAttributes?: SearchClientsReqDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<GetClientsReqDto> {
    return this.clientsService.findAll(searchAttributes, pageOptions);
  }

  @Get('getById/:id')
  @ApiOperation({
    operationId: 'getById',
    summary: 'Получить данные клиента по его уникальному идентификатору',
  })
  @ApiDefaultResponse({
    status: 200,
    description: 'Клиент',
    type: ClientDto,
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  @ApiNotFoundResponse(Constants.Response.NotFound)
  async getById(@Param('id', ParseIntPipe) id: string): Promise<ClientDto> {
    const client = await this.clientsService.findById(id);
    if (!client) {
      throw new ObjectNotFoundException('Клиент не найден');
    }
    return client;
  }

  @Get('getByPhone/:phone')
  @ApiOperation({
    operationId: 'getByPhone',
    summary: 'Получить данные клиента по номеру телефона',
  })
  @ApiDefaultResponse({
    status: 200,
    description: 'Клиент',
    type: ClientDto,
  })
  @ApiInternalServerErrorResponse(Constants.Response.InternalServerError)
  @ApiBadRequestResponse(Constants.Response.BadRequest)
  @ApiNotFoundResponse(Constants.Response.NotFound)
  async getByPhone(@Param('phone') phone: string): Promise<ClientDto> {
    const client = await this.clientsService.findByPhone(phone);
    if (!client) {
      throw new ObjectNotFoundException('Клиент не найден');
    }
    return client;
  }
}
