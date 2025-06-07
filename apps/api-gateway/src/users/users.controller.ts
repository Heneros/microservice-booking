import { USER_ROUTES, USERS_CONTROLLER } from '@app/common';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(@Inject('User') private readonly apiService: ClientProxy) {}

  @Get(USER_ROUTES.GET_ID_USER)
  @UseGuards(AuthGuard)
  async() {}
}
