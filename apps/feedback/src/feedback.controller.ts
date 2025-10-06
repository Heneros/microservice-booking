import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import {
  Comments,
  FEEDBACK_CONTROLLER,
  FEEDBACK_SERVICE,
  RmqService,
} from '@/libs/common/src';
import { CreateCommentDto } from '@/libs/common/src/dtos';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { CreateCommentCommand } from './commands/CreateComment.command';

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
    try {
      const res = await this.commandBus.execute(
        new CreateCommentCommand(createCommentDto),
      );
      this.rmqService.ack(context);
      // console.log('val', res);
      return plainToInstance(Comments, res);
    } catch (error) {
      this.rmqService.nack(context, false);
      // console.error(error);
      throw new RpcException(error.message);
    }
  }
}
