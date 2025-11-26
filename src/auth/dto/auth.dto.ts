// auth.dto.ts
import { IsString, IsNotEmpty, IsObject, IsNumber, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'Telegram Web App init data string',
    example: 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1600000000&hash=abc123...',
  })
  @IsString()
  @IsNotEmpty()
  initData: string;
}

export class UserResponseDto implements Pick<User,
  'id' | 'telegramId' | 'username' | 'firstName' | 'lastName' | 'languageCode' | 'createdAt' | 'updatedAt'
> {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Telegram user ID' })
  @IsNumber()
  telegramId: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  @IsString()
  @IsOptional()
  username: string | null;

  @ApiProperty({ description: 'First name', required: false })
  @IsString()
  @IsOptional()
  firstName: string | null;

  @ApiProperty({ description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  lastName: string | null;

  @ApiProperty({ description: 'Language code', required: false })
  @IsString()
  @IsOptional()
  languageCode: string | null;

  @ApiProperty({ description: 'Creation date' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @IsDate()
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT token for authentication' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'User data', type: UserResponseDto, example: {
      id: 'ef41d560-53f2-4597-b717-2de7475e525a',
      telegramId: 679878855,
      username: 'flexiG17',
      firstName: 'Арсений',
      lastName: 'Кожевников',
      languageCode: 'ru',
      createdAt: '2025-11-08T12:15:22.190Z',
      updatedAt: '2025-11-08T12:15:22.190Z',
    },
  })
  @IsObject()
  user: UserResponseDto;
}
