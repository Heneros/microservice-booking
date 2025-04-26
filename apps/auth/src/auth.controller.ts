import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constants';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getTest() {
    return 'Hello World';
  }

  @Post()
  async registerUser(@Body() request: RegisterUserDto) {
    return await this.authService.registerUser(request);
  }
}
