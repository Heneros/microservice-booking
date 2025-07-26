import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '@app/common';

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

// import { LoginUserCommand, RegisterUserCommand } from './commands/index';
export interface AuthRequest {
  jwt: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    userId: number;
    username?: string;
    roles: string[];
    exp: number;
  };
  message?: string;
}

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    //    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly verifyJwtService: VerifyJWTService,
    // @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  // @Get()
  // async getTest() {
  //   return await this.queryBus.execute(new FindAllUsersQuery());
  // }

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
    //   this.rmqService.ack(context);
    try {
      const result = await this.commandBus.execute(new LoginUserCommand(data));

      this.rmqService.ack(context);

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        // user: {
        //   id: result.user.id,
        //   name: result.user.name,
        //   email: result.user.email,
        // },
      };
    } catch (error) {
      //      this.rmqService.(context);
      throw new RpcException(error.message);
    }
  }

  // @MessagePattern({ cmd: AUTH_SERVICE.VERIFY_JWT })
  // async verifyJwt(@Ctx() context: RmqContext, @Payload() jwt: string) {
  //   // let ackCalled = false;

  //   try {
  //     // console.log('JWT received:', payload.jwt);

  //     const result = await this.verifyJwtService.verifyJwt(jwt);
  //     this.rmqService.ack(context);
  //      return {
  //       status: 'success',
  //       data: result,
  //     };
  //     // ackCalled = true;
  //     // }
  //   } catch (err) {
  //     console.error('Auth service error:', err.message);
  //     this.rmqService.ack(context);

  //     return {
  //       status: 'error',
  //       message: err.message || 'Invalid token',
  //     };
  //   }
  // }
  // @MessagePattern({ cmd: AUTH_SERVICE.DECODE_JWT })
  // async decodeJwt(
  //   @Ctx() context: RmqContext,
  //   @Payload() payload: { jwt: string },
  // ) {
  //   // console.log('payload ', payload.jwt);
  //   this.rmqService.ack(context);
  //   return this.verifyJwtService.getUserFromHeader(payload.jwt);
  // }


  // @UseGuards(JwtGuard)
  @MessagePattern('authenticate')
  async authenticate(    @Ctx() context: RmqContext,
    @Payload() data: AuthRequest,){


          console.log('JWT received:', data.jwt);

      if (!data || !data.jwt) {
        this.rmqService.ack(context);
        return {
          status: 'error',
          message: 'JWT token is required',
        };
      }

      const result = await this.verifyJwtService.verifyJwt(data.jwt)
      this.rmqService.ack(context);

      return {
        status: 'success',
        data: result,
      };
    } catch (err) {
      console.error('Auth service error:', err.message);
     // this.rmqService.ack(context);

      return {
        status: 'error',
        message: err.message || 'Invalid token',
      };
    }
  
  
}
