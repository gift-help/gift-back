import { ApiProperty } from '@nestjs/swagger';
import { TIdea } from '../../types/finalResponse';

export class SuggestResponseDto {
  @ApiProperty({ type: Array<TIdea>, description: 'Generated suggestions' })
  suggestions: TIdea[];
}

