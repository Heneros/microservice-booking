import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { lastValueFrom, timeout } from 'rxjs';
import { Response } from 'express';
import {
  AUTH_CONTROLLER,
  AUTH_ROUTES,
  AUTH_SERVICE,
  isDevelopment,
} from '@app/common';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(@Inject('AUTH') private readonly apiService: ClientProxy) {}

  @Post(AUTH_ROUTES.REGISTER)
  async register(@Body() request: RegisterUserDto) {
    try {
      const result = await lastValueFrom(
        this.apiService
          .send({ cmd: AUTH_SERVICE.REGISTER_USER }, request)
          .pipe(timeout(5000)),
      );
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Registration failed');
    }
  }

  @Post(AUTH_ROUTES.LOGIN)
  async login(
    @Body() request: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await lastValueFrom(
        this.apiService
          .send({ cmd: AUTH_SERVICE.LOGIN_USER }, request)
          .pipe(timeout(5000)),
      );

      res.cookie('jwtBooking', result.refreshToken, {
        httpOnly: !isDevelopment,
        sameSite: isDevelopment ? 'none' : 'strict',
        maxAge: 31 * 24 * 60 * 60 * 1000,
        secure: !isDevelopment,
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Login failed');
    }
  }
}
