import { Module } from '@nestjs/common';
import { TemporaryService } from './temporary.service';
import { TemporaryController } from './temporary.controller';

@Module({
  controllers: [TemporaryController],
  providers: [TemporaryService],
})
export class TemporaryModule {}
