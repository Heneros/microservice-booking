import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constants';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getTest() {
    return 'Hello World';
  }

  @Post()
  async registerUser(@Body() request: RegisterUserDto) {
    return await this.commandBus.execute(new RegisterUserCommand(request));
    // return await this.authService.registerUser(request);
  }

  @Get()
  async getUsers() {}
}
