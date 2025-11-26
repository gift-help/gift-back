import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, TelegramAuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @ApiOperation({ summary: 'Авторизация через Telegram Web App', description: 'Принимает initData от Telegram, проверяет подпись и возвращает JWT и данные пользователя.' })
  @ApiResponse({ status: 201, description: 'Токен и пользователь', type: AuthResponseDto })
  async telegramAuth(@Body() body: TelegramAuthDto): Promise<AuthResponseDto> {
    const userData = this.authService.verifyTelegramAuth(body.initData);

    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.upsertTelegramUser(userData);
    const token = this.authService.generateJwt(user.id, user.telegramId);

    return { token, user };
  }
}
