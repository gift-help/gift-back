import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { InfiniteScrollPaginationDto } from '../dto/pagination.dto';
import { GiftResponseDto } from './dto/gift-respone.dto';

@ApiTags('gift')
@Controller('gift')
export class GiftSessionController {
  constructor(private readonly giftSessionService: GiftSessionService) {}

  @Post('collect')
  @ApiOperation({ summary: 'Сбор данных для подбора подарков', description: 'Принимает объект со всеми сценариями (base, simpleDescription, tags, answers) и возвращает список ссылок по выбранным форматам.' })
  @ApiResponse({ status: 201, description: 'Ссылки на товары по выбранным площадкам', type: GiftResponseDto })
  async collectGiftSessionData(
    @Body() giftSessionDto: GiftSessionDto,
    @Query() pagination: InfiniteScrollPaginationDto,
  ) {
    return this.giftSessionService.collectGiftSessionData(giftSessionDto, pagination);
  }
}
