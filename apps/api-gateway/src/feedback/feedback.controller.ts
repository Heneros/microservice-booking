import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import {
  FEEDBACK_CONTROLLER,
  FEEDBACK_ROUTES,
  JwtAuthGuard,
} from '@/libs/common/src';
import { CreateFeedback } from './dto/CreateFeedback.dto';

@Controller(FEEDBACK_CONTROLLER)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post(FEEDBACK_ROUTES.CREATE_FEEDBACK)
  createComment(@Body() data: CreateFeedback) {
    return this.feedbackService.createComment(data);
  }
}
