import { Controller, Get, NotFoundException, Req } from '@nestjs/common';

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
import { FindAllUsersQuery } from './query/FindAllUsers.query';

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
      this.rmqService.ack(context);

      const userEntity = plainToInstance(UserEntity, profile, {
        excludeExtraneousValues: true,
      });

      return userEntity;
    } catch (error) {
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: USERS_SERVICE.ALL_USERS })
  async getAllUsers(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      const users = await this.queryBus.execute(new FindAllUsersQuery(data));

      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }

      this.rmqService.ack(context);

      return plainToInstance(UserEntity, users);
    } catch (error) {
      this.rmqService.nack(context, false);

      if (error instanceof RpcException) {
        throw error;
      }

      const errorResponse = {
        status: 'error',
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || 500,
      };
      throw new RpcException(errorResponse);
    }
  }
}
