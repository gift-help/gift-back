import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SuggestDto } from './dto/suggest.dto';
import { SuggestResponseDto } from './dto/suggest-response.dto';

@Controller('ai')
@ApiTags('AI')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  @ApiOperation({ summary: 'Suggest gift ideas by keywords' })
  @ApiBody({ type: SuggestDto })
  @ApiResponse({ status: 201, description: 'List of suggested gifts', type: SuggestResponseDto })
  async suggest(@Body() body: SuggestDto): Promise<SuggestResponseDto> {
    const items = await this.aiService.generateGiftIdeas(body.keywords);
    return { suggestions: items };
  }
}
