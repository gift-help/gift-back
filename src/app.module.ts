import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TemporaryModule } from './temporary/temporary.module';

@Module({
  imports: [TemporaryModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
