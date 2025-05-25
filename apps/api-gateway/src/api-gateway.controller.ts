import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterUserDto } from 'apps/auth/src/dto';
import { lastValueFrom, timeout } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH') private readonly apiService: ClientProxy,
    private readonly apiGatewayService: ApiGatewayService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello World!!!!!!';
  }

  @Post('auth/register')
  async register(@Body() request: RegisterUserDto) {
    try {
      // console.log('register ', request);

      const result = await lastValueFrom(
        this.apiService
          .send({ cmd: 'register_user' }, request)
          .pipe(timeout(5000)),
      );
      console.log('API Gateway:  ', result);
      return result;
    } catch (error) {
      console.error('register error', error);
      throw error;
    }
  }
}
