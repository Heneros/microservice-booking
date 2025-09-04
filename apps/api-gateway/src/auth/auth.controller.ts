import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError, last, lastValueFrom, throwError, timeout } from 'rxjs';
import { Response } from 'express';
import {
  AUTH_CONTROLLER,
  AUTH_ROUTES,
  AUTH_SERVICE,
  AuthEntity,
  CustomRequest,
  EmailDto,
  isDevelopment,
} from '@/app/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE.AUTH_MAIN) private readonly apiService: ClientProxy,
  ) {}

  @Post(AUTH_ROUTES.REGISTER)
  @ApiResponse({
    status: 201,
    description: 'Registration success',
  })
  @ApiOperation({ summary: 'Registration user' })
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
  @ApiResponse({
    status: 200,
    description: 'Log in success',
  })
  @ApiOperation({ summary: 'Log in' })
  async login(
    @Body() request: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(6666);
    try {
      const result = await lastValueFrom(
        this.apiService.send({ cmd: AUTH_SERVICE.LOGIN_USER }, request).pipe(
          timeout(5000),
          catchError((error) => {
            console.error('Error Login', error);
            return throwError(() => error);
          }),
        ),
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

  @Post(AUTH_ROUTES.LOGOUT)
  @ApiResponse({
    status: 302,
    description: 'Log out successfully',
  })
  @ApiOperation({
    summary: 'Log out for application ',
  })
  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    //  console.log('Log out for application');
    try {
      if (!req.session) {
        return res.status(400).json({ message: 'Session not found' });
      }

      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(new Error('Failed to destroy session'));
          } else {
            resolve();
          }
        });
      });
      res.clearCookie('jwtBooking');
      res.clearCookie('connect.sid');

      return res.status(200).json({ message: 'Logged out successfully!!' });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Logout failed');
    }
  }

  @Get(AUTH_ROUTES.VERIFY)
  @ApiOperation({ summary: 'Verify email. Enter id user and token' })
  @ApiCreatedResponse({
    description: 'The user has been successfully verified email.',
    type: AuthEntity,
  })
  @ApiNotFoundResponse({
    description: 'Invalid or expired token.',
  })
  async verifyEmail(
    @Param('emailToken') token: string,
    @Param('userId') userId: number,
  ) {
    const payload = { token, userId };
    try {
      const res = await lastValueFrom(
        this.apiService.send({ cmd: AUTH_SERVICE.VERIFY_USER }, payload).pipe(
          timeout(5000),
          catchError((error) => {
            console.error('Error Verify', error);
            return throwError(() => error);
          }),
        ),
      );

      return res;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Verify failed');
    }
  }

  @Post(AUTH_ROUTES.RESEND_EMAIL)
  @ApiOperation({ summary: 'Action to resend email to receive token' })
  @ApiCreatedResponse({
    description: 'Email was successfully sent to user.',
    type: AuthEntity,
  })
  async resendEmail(
    @Body()
    emailDto: EmailDto,
  ) {
    try {
      const res = await lastValueFrom(
        this.apiService
          .send({ cmd: AUTH_SERVICE.RESEND_EMAIL }, emailDto.email)
          .pipe(
            timeout(5000),
            catchError((error) => {
              console.error('Error Verify', error);
              return throwError(() => error);
            }),
          ),
      );
      return res;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(error.message || 'Resend failed');
    }
    // console.log(emailDto.email)
  }

  @Get('ping')
  async handleGet() {
    return this.apiService.send({ cmd: 'ping' }, {});
  }
}
