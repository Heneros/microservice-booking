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
import { CurrentUser, RegisterUserDto } from '@/app/common';

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
} from '@/app/common';
import { RegisterUserCommand } from './commands/RegisterUser.command';
import { LoginUserCommand } from './commands/LoginUser.command';

import { JwtService } from '@nestjs/jwt';
import { VerifyUserQuery } from './queries/VerifyUser.query';
import { ResendEmailCommand } from './commands/ResendEmail.command';
import { ResetPasswordRequestCommand } from './commands/RequestResetPassword.command';
import { ResetPasswordCommand } from './commands/ResetPassword.command';

// import { LoginUserCommand, RegisterUserCommand } from './commands/index';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rmqService: RmqService,
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
    //  console.log('Received login request');
    //  this.rmqService.ack(context);
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
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }

  // @UseGuards(JwtGuard)
  @MessagePattern(AUTH_SERVICE.VALIDATE_USER)
  async validateUser(
    @Payload() data: { Authentication: string },
    @Ctx() context: RmqContext,
  ) {
    const token = data.Authentication;
    this.rmqService.ack(context);

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

  @MessagePattern({ cmd: AUTH_SERVICE.VERIFY_USER })
  async verifyEmail(
    @Payload() data: { token; userId },
    @Ctx() context: RmqContext,
  ) {
    try {
      const { token, userId } = data;
      const result = await this.queryBus.execute(
        new VerifyUserQuery(token, userId),
      );
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: AUTH_SERVICE.RESEND_EMAIL })
  async resendEmail(@Payload() email, @Ctx() context: RmqContext) {
    try {
      // console.log(email);
      const result = await this.commandBus.execute(
        new ResendEmailCommand(email),
      );
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: AUTH_SERVICE.RESET_REQUEST_PASSWORD })
  async resetRequestPassword(@Payload() email, @Ctx() context: RmqContext) {
    try {
      // console.log(email);
      const result = await this.commandBus.execute(
        new ResetPasswordRequestCommand(email),
      );
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: AUTH_SERVICE.RESET_PASSWORD })
  async resetPassword(@Payload() data, @Ctx() context: RmqContext) {
    try {
      // console.log(email);
      const { userId, resetPasswordDto } = data;
      const result = await this.commandBus.execute(
        new ResetPasswordCommand(userId, resetPasswordDto),
      );
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.nack(context, false);
      throw new RpcException(error.message);
    }
  }
}
