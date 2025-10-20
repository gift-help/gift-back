import { Controller, Get } from '@nestjs/common';
import { TemporaryService } from './temporary.service';

@Controller('temporary')
export class TemporaryController {
  constructor(private readonly temporaryService: TemporaryService) {}

  @Get('/generate-gifts')
  findAll() {
    return this.temporaryService.generateGifts();
  }
}
