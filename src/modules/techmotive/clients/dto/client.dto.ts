import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { PageDto } from 'src/common/dto/page.dto';

import { AddressDto } from './address.dto';

export class ClientDto {
  @IsString()
  @ApiProperty()
  first_name!: string;

  @IsString()
  @ApiProperty()
  last_name!: string;

  @IsString()
  @IsOptional()
  @Transform((params) => (params.value === '' ? null : params.value))
  @ApiPropertyOptional()
  patronymic?: string | null;

  @IsArray()
  @ApiProperty({ type: () => [AddressDto] })
  addresses?: AddressDto[];

  @IsPhoneNumber('RU')
  @ApiProperty({ example: '+79852668147' })
  phone!: string;

  @IsString()
  @IsOptional()
  @Transform((params) => (params.value === '' ? null : params.value))
  @ApiPropertyOptional({
    example: 'Пажилой клиент',
  })
  about_client?: string | null;

  static create(data: ClientDto) {
    return { message: 'Клиент успешно создан!', data };
  }

  static update(data: ClientDto) {
    return { message: 'Клиент успешно обновлен!', data };
  }
}

export class GetClientsReqDto extends PageDto {
  @ApiProperty({ isArray: true, type: () => ClientDto })
  data: ClientDto[];
}

export class UpdateClientReqDto extends PartialType(ClientDto) {}

export class SearchClientsReqDto extends PickType(PartialType(ClientDto), [
  'first_name',
  'last_name',
  'patronymic',
  'addresses',
  'phone',
]) {}

export class ClientSuccessResDto {
  @ApiProperty({ example: 'Сообщение об успешной операции!' })
  message: string;

  @ApiProperty()
  data!: ClientDto;
}
