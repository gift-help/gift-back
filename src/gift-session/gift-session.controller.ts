import { Body, Controller, Post, Query } from '@nestjs/common';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { InfiniteScrollPaginationDto } from '../dto/pagination.dto';

@Controller('gift')
export class GiftSessionController {
  constructor(private readonly giftSessionService: GiftSessionService) {}

  @Post('collect')
  async collectGiftSessionData(
    @Body() giftSessionDto: GiftSessionDto,
    @Query() pagination: InfiniteScrollPaginationDto,
  ) {
    return this.giftSessionService.collectGiftSessionData(giftSessionDto, pagination);
  }
}
