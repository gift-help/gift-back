import { ApiProperty } from '@nestjs/swagger';
import { TIdea } from '../../types/finalResponse';

export class GiftItemDto implements TIdea {
  @ApiProperty({
    description: 'Название идеи подарка',
    example: 'Умный термостат для дома'
  })
  title: string;

  @ApiProperty({
    description: 'Поисковый запрос для маркетплейса',
    example: 'умный термостат для дома автоматизация'
  })
  searchQuery: string;

  @ApiProperty({
    description: 'Описание идеи подарка',
    example: 'Поможет оптимизировать температуру в доме и сэкономить энергию'
  })
  description: string;
}

export class GiftFiltersDto {
  @ApiProperty({ description: 'Стоимость от', example: 500, required: false })
  costFrom?: number | null;

  @ApiProperty({ description: 'Стоимость до', example: 5000, required: false })
  costTo?: number | null;

  @ApiProperty({ description: 'Выбранные источники', isArray: true, example: ['wildberries', 'ozon'], required: false })
  sources?: string[];

  @ApiProperty({ description: 'Срок доставки (например "1-3 дня")', example: '1-3 дня', required: false })
  deliveryTime?: string | null;
}

export class GiftResponseDto {
  @ApiProperty({ description: 'Список найденных/предложенных товаров', isArray: true, type: GiftItemDto, required: false })
  gifts?: GiftItemDto[];
}
