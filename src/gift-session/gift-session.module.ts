import { Module } from '@nestjs/common';
import { GiftSessionService } from './gift-session.service';
import { GiftSessionController } from './gift-session.controller';

@Module({
  controllers: [GiftSessionController],
  providers: [GiftSessionService],
})
export class GiftSessionModule {}
