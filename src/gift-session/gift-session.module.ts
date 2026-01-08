import { Module } from '@nestjs/common';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionController } from './gift-session.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [GiftSessionController],
  providers: [GiftSessionService],
})
export class GiftSessionModule {}
