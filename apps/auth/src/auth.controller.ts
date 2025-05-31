import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constants';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/RegisterUser.command';
import { FindAllUsersQuery } from './queries/GetUsers.query';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
    // @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  @Get()
  async getTest() {
    return await this.queryBus.execute(new FindAllUsersQuery());
  }

  @MessagePattern({ cmd: 'register_user' })
  // async registerUser(@Body() request: RegisterUserDto) {
  async handleRegistration(
    @Payload() data: RegisterUserDto,
    @Ctx() context: RmqContext,
  ) {
    console.log('Received registration request');

    try {
      const user = await this.commandBus.execute(new RegisterUserCommand(data));
      this.rmqService.ack(context);
      return { success: true, user };
    } catch (error) {
      this.rmqService.ack(context);
      throw new RpcException(error.message);
    }
  }
  //   const user = await this.commandBus.execute(new RegisterUserCommand(data));
  //   // console.log(123);
  //   // console.log('AUTH: ', user);

  //   this.rmqService.ack(context);
  //   try {
  //     console.log({ success: true });
  //     return { success: true, user };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // }
}
