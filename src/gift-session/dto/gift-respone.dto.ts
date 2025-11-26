import { ApiProperty } from '@nestjs/swagger';

export class GiftResponseDto {
  @ApiProperty({ description: 'Links for Wildberries', isArray: true, example: ['link1', 'link2'], required: false })
  WILDBERRIES?: string[];

  @ApiProperty({ description: 'Links for Ozon', isArray: true, example: ['link1', 'link2'], required: false })
  OZON?: string[];

  @ApiProperty({ description: 'Links for Yandex Market', isArray: true, example: ['link1', 'link2'], required: false })
  YANDEX_MARKET?: string[];

  // @ApiProperty({ description: '[DEPRECATED] Ideas only', isArray: true, required: false, example: ['idea1', 'idea2'] })
  // IDEA_ONLY?: string[];
}
