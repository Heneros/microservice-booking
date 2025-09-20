import { Controller, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  getHello(): string {
    return this.feedbackService.getHello();
  }
}
