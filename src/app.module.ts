import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GiftSessionModule } from './gift-session/gift-session.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, GiftSessionModule, AiModule],
  controllers: [],
  providers: []
})

export class AppModule {}
