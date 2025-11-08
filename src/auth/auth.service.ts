import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  verifyTelegramAuth(initData: string): { telegramId: number; username?: string; firstName?: string; lastName?: string } | null {
    const botToken = process.env.BOT_TOKEN || '';
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckArr = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckArr).digest('hex');

    if (hmac !== hash) {
      return null;
    }

    const userJson = urlParams.get('user');
    if (!userJson) {
      return null;
    }

    const userData = JSON.parse(userJson);

    return {
      telegramId: userData.id,
      username: userData.username,
      firstName: userData.first_name,
      lastName: userData.last_name,
    };
  }

  async upsertTelegramUser(userData: { telegramId: number; username?: string; firstName?: string; lastName?: string }) {
    return this.prisma.user.upsert({
      where: { telegramId: userData.telegramId },
      update: {},
      create: {
        telegramId: userData.telegramId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });
  }

  generateJwt(userId: string, telegramId: number): string {
    return this.jwtService.sign({ id: userId, telegramId });
  }
}
