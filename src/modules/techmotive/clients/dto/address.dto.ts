import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
  // @IsString()
  // @ApiProperty()
  // client_id: number;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;
}
