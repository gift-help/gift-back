import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { User } from '@prisma/client';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'Telegram Web App init data string',
    example: 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1600000000&hash=abc123...'
  })
  @IsString()
  @IsNotEmpty()
  initData: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT token for authentication' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'User data' })
  @IsObject()
  user: User;
}
