import { ApiProperty } from '@nestjs/swagger';

export class GiftItemDto {
  @ApiProperty({ description: 'Название товара', example: 'Подарочная кружка' })
  name: string;

  @ApiProperty({ description: 'Источник товара (wildberries, yandex market, ozon и т.п.)', example: 'wildberries' })
  source: string;

  @ApiProperty({ description: 'Стоимость в рублях', example: 1299 })
  price: number;

  @ApiProperty({ description: 'Ссылка на картинку товара', example: 'https://cdn.example.com/image.jpg' })
  image: string;

  @ApiProperty({ description: 'Короткое описание товара', example: 'Керамическая кружка с принтом' })
  description: string;

  @ApiProperty({ description: 'Ссылка на страницу товара', example: 'https://www.wildberries.ru/catalog/220043185/detail.aspx' })
  url: string;
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

  @ApiProperty({ description: 'Общие выставленные фильтры для результата', type: GiftFiltersDto, required: false })
  filters?: GiftFiltersDto;
}
