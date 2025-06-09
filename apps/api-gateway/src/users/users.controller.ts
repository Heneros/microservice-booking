import {
  USER_ROUTES,
  UserInterceptor,
  UserJwt,
  UserRequest,
  USERS_CONTROLLER,
  USERS_SERVICE,
} from '@app/common';
import { CurrentUser } from '@app/common/decorator/current-user.decorator';
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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface User {
  id: number;
}
@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(@Inject('USERS') private readonly apiService: ClientProxy) {}

  @UseGuards(AuthGuard)
  // @UseInterceptors(UserInterceptor)
  @Get(USER_ROUTES.MY_ACCOUNT)
  // async getProfile(@Req() req: UserRequest) {
  async getProfile(@CurrentUser() user: User) {
    try {
      console.log('CurrentUser:', user);
      return this.apiService.send(
        { cmd: USERS_SERVICE.MY_PROFILE },
        { userId: user.id },
      );
      // console.log(123);
      // return this.apiService.send(
      //   { cmd: USERS_SERVICE.MY_PROFILE },
      //   { userId: req.user.id },
      // );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Get profile failed');
    }
  }
}
