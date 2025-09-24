import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  createComment(@Body() data: any) {
    return this.feedbackService.createComment(data);
  }
}
