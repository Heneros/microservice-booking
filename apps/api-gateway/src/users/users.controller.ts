import {

  CurrentUser,
  JwtAuthGuard,
  USER_ROUTES,
  USERS_CONTROLLER,
  USERS_SERVICE,
} from '@app/common';

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


import { catchError, throwError, lastValueFrom } from 'rxjs';


@Controller(USERS_CONTROLLER)
export class UsersController {
  constructor(@Inject(USERS_SERVICE.USERS_MAIN) private readonly apiService: ClientProxy) {}


 
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
    this.apiService.send(   { cmd: USERS_SERVICE.MY_PROFILE }, payload),
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

  // @Get(USER_ROUTES.GET_ALL)
}
