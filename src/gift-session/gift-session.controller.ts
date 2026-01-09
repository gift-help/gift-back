import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { GiftResponseDto } from './dto/gift-respone.dto';

@ApiTags('gift')
@Controller('gift')
export class GiftSessionController {
  constructor(private readonly giftSessionService: GiftSessionService) {}

  @Post('collect')
  @ApiOperation({
    summary: 'Сбор данных для подбора подарков',
    description:
      'Принимает объект со сценариями (base, simpleDescription, tags, answers) и возвращает массив объектов подарков. '
  })
  @ApiResponse({
    status: 201,
    description: 'Массив объектов подарков и применённые фильтры',
    type: GiftResponseDto,
  })
  async collectGiftSessionData(
    @Body() giftSessionDto: GiftSessionDto,
  ) {

    return this.giftSessionService.collectGiftSessionData(giftSessionDto);
  }
}
