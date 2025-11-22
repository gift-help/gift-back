import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { GiftSessionModule } from './gift-session/gift-session.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, GiftSessionModule, AiModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
