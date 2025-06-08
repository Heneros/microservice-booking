import { USER_ROUTES, USERS_CONTROLLER, USERS_SERVICE } from '@app/common';
import { AuthGuard } from '@app/common/guards/auth.guard';
import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(@Inject('USERS') private readonly apiService: ClientProxy) {}

  @Get(USER_ROUTES.GET_ID_USER)
  @UseGuards(AuthGuard)
  async getProfile(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return this.apiService.send({ cmd: USERS_SERVICE.MY_PROFILE }, userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Get profile failed');
    }
  }
}
