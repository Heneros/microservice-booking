import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constants';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands';
import { FindAllUsersQuery } from './queries/GetUsers.query';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getTest() {
    return await this.queryBus.execute(new FindAllUsersQuery());
    // return 'Hello World';
  }

  @Post()
  async registerUser(@Body() request: RegisterUserDto) {
    return await this.commandBus.execute(new RegisterUserCommand(request));
    // return await this.authService.registerUser(request);
  }
}
