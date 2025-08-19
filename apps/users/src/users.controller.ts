import { Controller, Get, Req } from '@nestjs/common';

import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import {
  RmqService,
  UserEntity,
  USERS_CONTROLLER,
  USERS_SERVICE,
} from '@/app/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileQuery } from './query/GetProfile.query';
import { plainToInstance } from 'class-transformer';

@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: USERS_SERVICE.MY_PROFILE })
  async handleGetProfile(
    @Payload() data: { userId: number; Authentication: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      // console.log('userId', data.userId);

      const profile = await this.queryBus.execute(
        new GetProfileQuery(data.userId),
      );

      const userEntity = plainToInstance(UserEntity, profile, {
        excludeExtraneousValues: true,
      });
      this.rmqService.ack(context);
      return userEntity;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
