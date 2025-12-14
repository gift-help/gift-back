import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { InfiniteScrollPaginationDto } from '../dto/pagination.dto';
import { GiftResponseDto } from './dto/gift-respone.dto';

@ApiTags('gift')
@Controller('gift')
export class GiftSessionController {
  constructor(private readonly giftSessionService: GiftSessionService) {}

  @Post('collect')
  @ApiOperation({
    summary: 'Сбор данных для подбора подарков',
    description:
      'Принимает объект со сценариями (base, simpleDescription, tags, answers) и возвращает массив объектов подарков и общие фильтры. ' +
      'Фильтры передаются через query-параметры.',
  })
  @ApiQuery({ name: 'costFrom', required: false, description: 'Стоимость от (число)', schema: { type: 'number' } })
  @ApiQuery({ name: 'costTo', required: false, description: 'Стоимость до (число)', schema: { type: 'number' } })
  @ApiQuery({ name: 'sources', required: false, description: 'Источники (comma-separated или повторяющийся параметр), например: wildberries,ozon,yandex market' })
  @ApiQuery({ name: 'deliveryTime', required: false, description: 'Срок доставки (например "1-3 дня")' })
  @ApiResponse({
    status: 201,
    description: 'Массив объектов подарков и применённые фильтры',
    type: GiftResponseDto,
  })
  async collectGiftSessionData(
    @Body() giftSessionDto: GiftSessionDto,
    @Query() pagination: InfiniteScrollPaginationDto,
    @Query('costFrom') costFrom?: string,
    @Query('costTo') costTo?: string,
    @Query('sources') sources?: string | string[],
    @Query('deliveryTime') deliveryTime?: string,
  ) {
    const queryFilters = {
      costFrom,
      costTo,
      sources,
      deliveryTime,
    };

    return this.giftSessionService.collectGiftSessionData(giftSessionDto, pagination, queryFilters);
  }
}
