import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class InfiniteScrollPaginationDto {
  @ApiProperty({ description: 'Number of items to fetch', example: 10 })
  @IsInt()
  @Min(1)
  take: number;

  @ApiProperty({ description: 'Cursor for infinite scrolling', example: 20, required: false })
  @IsOptional()
  @IsInt()
  cursor?: number;
}
