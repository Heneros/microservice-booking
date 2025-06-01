import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from '../dto';
import { lastValueFrom, timeout } from 'rxjs';

@Controller('user')
export class UsersController {
  // constructor(@Inject('User') private readonly apiService: ClientProxy) {}
}
