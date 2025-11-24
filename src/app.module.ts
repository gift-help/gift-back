import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GiftSessionModule } from './gift-session/gift-session.module';

@Module({
  imports: [AuthModule, GiftSessionModule],
  controllers: [],
  providers: []
})

export class AppModule {}
