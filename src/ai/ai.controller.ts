import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SuggestResponseDto } from './dto/suggest-response.dto';
import { GiftSessionDto } from '../gift-session/dto/gift-session.dto';

@Controller('ai')
@ApiTags('AI')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  @ApiOperation({ summary: '[BACKEND ONLY] Suggest gift ideas by keywords' })
  @ApiBody({ type: GiftSessionDto })
  @ApiResponse({ status: 201, description: 'List of suggested gifts', type: SuggestResponseDto })
  async suggest(@Body() body: GiftSessionDto): Promise<SuggestResponseDto> {
    const items = await this.aiService.generateGiftIdeas(body);
    return { suggestions: items };
  }
}
