import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { AUTH_CONTROLLER } from './sites/constansts';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async registerUser(@Body() request: RegisterUserDto) {
    return this.authService.registerUser(request);
  }
}
