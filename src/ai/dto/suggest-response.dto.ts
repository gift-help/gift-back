import { ApiProperty } from '@nestjs/swagger';

export class SuggestResponseDto {
  @ApiProperty({ type: [String], description: 'Generated suggestions' })
  suggestions: string[];
}

