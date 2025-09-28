import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  FEEDBACK_CONTROLLER,
  FEEDBACK_SERVICE,
  RmqService,
} from '@/libs/common/src';
import { CreateCommentDto } from '@/libs/common/src/dtos';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller(FEEDBACK_CONTROLLER)
export class FeedbackController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: FEEDBACK_SERVICE.FEEDBACK_CREATE })
  async createComment(
    @Payload() createCommentDto: CreateCommentDto,
    @Ctx() context: RmqContext,
  ) {
    const res = await this.commandBus.execute(createCommentDto);
    this.rmqService.ack(context);
  }
}
