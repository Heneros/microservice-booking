import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, RegisterUserDto } from '@app/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import {
  AUTH_CONTROLLER,
  AUTH_SERVICE,
  LoginUserDto,
  RmqService,
} from '@app/common';
import { RegisterUserCommand } from './commands/RegisterUser.command';
import { LoginUserCommand } from './commands/LoginUser.command';
import { JwtGuard } from './guards/jwt.guard';
import { VerifyJWTService } from './services/verifyJwt.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LogoutCommand } from './commands/Logout.command';
// import { LoginUserCommand, RegisterUserCommand } from './commands/index';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
    private readonly verifyJwtService: VerifyJWTService,
    private readonly jwtService: JwtService,
    // @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  @MessagePattern({ cmd: AUTH_SERVICE.REGISTER_USER })
  // async registerUser(@Body() request: RegisterUserDto) {
  async handleRegistration(
    @Payload() data: RegisterUserDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const user = await this.commandBus.execute(new RegisterUserCommand(data));
      this.rmqService.ack(context);
      return { success: true, user };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: AUTH_SERVICE.LOGIN_USER })
  async handleLogin(@Payload() data: LoginUserDto, @Ctx() context: RmqContext) {
    console.log('Received login request');
    //   this.rmqService.ack(context);
    try {
      const result = await this.commandBus.execute(new LoginUserCommand(data));

      this.rmqService.ack(context);

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      };
    } catch (error) {
      this.rmqService.ack(context);
      throw new RpcException(error.message);
    }
  }

  // @UseGuards(JwtGuard)
  @MessagePattern('validate_user')
  async validateUser(@Payload() data: { Authentication: string }) {
    const token = data.Authentication;

    const user = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return user;
  }

  @MessagePattern({ cmd: 'ping' })
  ping() {
    console.log('PING RECEIVED');
    return 'pong';
  }
}
