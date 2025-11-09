import { ApiProperty } from '@nestjs/swagger';

export class GiftResponseDto {
  @ApiProperty({ description: 'Links for Wildberries', isArray: true, example: ['link1', 'link2'] })
  WILDBERRIES?: string[];

  @ApiProperty({ description: 'Links for Ozon', isArray: true, example: ['link1', 'link2'] })
  OZON?: string[];

  @ApiProperty({ description: 'Links for Yandex Market', isArray: true, example: ['link1', 'link2'] })
  YANDEX_MARKET?: string[];

  @ApiProperty({ description: '[DEPRECATED] Ideas only', isArray: true })
  IDEA_ONLY?: string[];
}
