import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { GiftResponseDto } from './dto/gift-respone.dto';
import { TIdea } from '../types/finalResponse';

@Injectable()
export class GiftSessionService {
  constructor(private readonly aiService: AiService) {}

  async collectGiftSessionData(
    data: GiftSessionDto,
  ): Promise<GiftResponseDto> {
    const response: GiftResponseDto = {};

    let suggestions: TIdea[] = [
      {
        "title": "Умный термостат для дома",
        "searchQuery": "умный термостат для дома автоматизация",
        "description": "Поможет оптимизировать температуру в доме и сэкономить энергию, что соответствует интересам в области умного дома.",
      }
    ];
    try {
      suggestions = await this.aiService.generateGiftIdeas(data);
    } catch (error) {
      console.error('AI service error', error);
      throw new HttpException(
        'Ошибка при запросе к AI-сервису',
        HttpStatus.BAD_GATEWAY,
      );
    }

    response.gifts = suggestions;

    // await setTimeout(Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000);

    return response;
  }
}
