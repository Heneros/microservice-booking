import {
  CurrentUser,
  JwtAuthGuard,
  Roles,
  USER_ROUTES,
  UserEntity,
  USERS_CONTROLLER,
  USERS_SERVICE,
} from '@/app/common';
import { AuthGuard } from '@/app/common/guards/auth.guard';
import { RolesGuard } from '@/app/common/guards/roles.guard';

import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { catchError, throwError, lastValueFrom, timeout } from 'rxjs';

@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE.USERS_MAIN) private readonly apiService: ClientProxy,
  ) {}

  @Get(USER_ROUTES.MY_ACCOUNT)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get my profile',
  })
  @ApiOperation({ summary: 'Get  my profile' })
  @ApiBearerAuth('access-token')
  // async getProfile(@CurrentUser() user: any) {
  async getProfile(@Req() req: any) {
    try {
      const user = req.user;
      const token = req.cookies.jwtBooking;
      const payload = { userId: user.userId, Authentication: token };

      const profile = await lastValueFrom(
        this.apiService
          .send({ cmd: USERS_SERVICE.MY_PROFILE }, payload)
          .pipe(timeout(5000)),
      );
      return profile;
    } catch (err) {
      if (err.name === 'EmptyError') {
        console.error('RPC pattern not found or handler did not return:', err);
        throw new BadGatewayException('Profile service unavailable');
      }
      console.error('GetProfile error:', err);
      throw new BadGatewayException(err.message || 'Get profile failed');
    }
  }

  @Get(USER_ROUTES.GET_ALL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Editor')
  @ApiCookieAuth('cookie-auth')
  @ApiOperation({ summary: 'For admin. Get All User' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  async findAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    try {
          const correlationId = randomUUID();
    const payload = { page, correlationId };

    const users = await lastValueFrom(
      this.apiService.send({ cmd: USERS_SERVICE.ALL_USERS },  page)    
        .pipe(timeout(5000)),

    );


    return users;
    } catch (error) {
    console.log('error.message ', error.message)
    throw error;
    }

  }
}
