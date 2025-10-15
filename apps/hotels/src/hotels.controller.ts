import { Controller, Get } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller()
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  getHello(): string {
    return this.hotelsService.getHello();
  }
}
