import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto';

export class PageDto {
  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;
}
