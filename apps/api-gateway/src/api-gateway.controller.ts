import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController {
  constructor(
    // @Inject('AUTH') private readonly apiService: ClientProxy,
    private readonly apiGatewayService: ApiGatewayService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello World!!!!!!';
  }
}
