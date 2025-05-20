import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constants';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands';
import { FindAllUsersQuery } from './queries/GetUsers.query';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  @Get()
  async getTest() {
    return await this.queryBus.execute(new FindAllUsersQuery());
    // return 'Hello World';
  }

  @Post()
  async registerUser(@Body() request: RegisterUserDto) {
    const user = await this.commandBus.execute(
      new RegisterUserCommand(request),
    );
    try {
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );

      return user;
    } catch (error) {
      console.error(error);
    }

    // return await this.authService.registerUser(request);
  }
}
