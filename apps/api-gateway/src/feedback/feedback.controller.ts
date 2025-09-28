import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import {
  FEEDBACK_CONTROLLER,
  FEEDBACK_ROUTES,
  FEEDBACK_SERVICE,
  JwtAuthGuard,
} from '@/libs/common/src';
import { CreateFeedback } from './dto/CreateFeedback.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller(FEEDBACK_CONTROLLER)
export class FeedbackController {
  constructor(
    @Inject(FEEDBACK_SERVICE.FEEDBACK_MAIN)
    private readonly apiService: ClientProxy,
    private readonly feedbackService: FeedbackService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(FEEDBACK_ROUTES.CREATE_FEEDBACK)
  async createComment(@Body() data: CreateFeedback) {
    try {
      const res = await lastValueFrom(
        this.apiService.send({ cmd: FEEDBACK_SERVICE.FEEDBACK_CREATE }, data),
      );
      // console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }

    // return this.feedbackService.createComment(data);
  }
}
