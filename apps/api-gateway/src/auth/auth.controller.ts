import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from '../dto';
import { lastValueFrom, timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH') private readonly apiService: ClientProxy) {}

  @Post('register')
  async register(@Body() request: RegisterUserDto) {
    try {
      // console.log('register ', request);

      const result = await lastValueFrom(
        this.apiService
          .send({ cmd: 'register_user' }, request)
          .pipe(timeout(8000)),
      );
      console.log('API Gateway:  ', result);
      return result;
    } catch (error) {
      console.error('register error', error);
      throw error;
    }
  }
}
