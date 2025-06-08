import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { RmqService, USERS_CONTROLLER, USERS_SERVICE } from '@app/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileQuery } from './query/GetProfile.query';

@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern({ cmd: USERS_SERVICE.MY_PROFILE })
  async handleGetProfile(
    @Payload() userId: number,
    @Ctx() context: RmqContext,
  ) {
    try {
      const profile = await this.queryBus.execute(new GetProfileQuery(userId));
      this.rmqService.ack(context);
      return profile;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
