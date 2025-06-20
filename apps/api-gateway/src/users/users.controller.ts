import {
  USER_ROUTES,
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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';

// export interface User {
//   userId: number;

// }

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    roles: string[];
    exp: number;
  };
}
@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(@Inject('USERS') private readonly apiService: ClientProxy) {}

  @UseGuards(AuthGuard)
  // @UseInterceptors(UserInterceptor)
  @Get(USER_ROUTES.MY_ACCOUNT)
  @ApiResponse({
    status: 200,
    description: 'Get my profile',
  })
  @ApiOperation({ summary: 'Get  my profile' })
  @ApiBearerAuth('access-token')
  // async getProfile(@CurrentUser() user: any) {
  async getProfile(@Req() req: AuthenticatedRequest) {
    try {
      const { userId } = req.user;
      console.log('CurrentUser:', userId);
      const result = this.apiService.send(
        { cmd: USERS_SERVICE.MY_PROFILE },
        userId,
      );

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Get profile failed');
    }
  }

  // @Get(USER_ROUTES.GET_ALL)
}
