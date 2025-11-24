import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, TelegramAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  async telegramAuth(@Body() body: TelegramAuthDto): Promise<AuthResponseDto > {
    const userData = this.authService.verifyTelegramAuth(body.initData);

    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.upsertTelegramUser(userData);
    const token = this.authService.generateJwt(user.id, user.telegramId);

    return { token, user };
  }
}
