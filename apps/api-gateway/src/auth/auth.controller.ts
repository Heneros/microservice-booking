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
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError, last, lastValueFrom, throwError, timeout } from 'rxjs';
import type { Request, Response } from 'express';
import {
  AUTH_CONTROLLER,
  AUTH_ROUTES,
  AUTH_SERVICE,
  AuthEntity,
  EmailDto,
  EmailValidationPipe,
  isDevelopment,
  ResetPasswordDto,
} from '@/app/common';

import type { CustomRequest } from '@/app/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import { PassportService } from './services/Passport.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE.AUTH_MAIN) private readonly apiService: ClientProxy,
    private jwt: JwtService,
    private readonly passportService: PassportService,
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

  @Throttle({ default: { limit: 15, ttl: 60000 } })
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
      const correlationId = randomUUID();

      const payload = { ...request, correlationId };
      const result = await lastValueFrom(
        this.apiService.send({ cmd: AUTH_SERVICE.LOGIN_USER }, payload).pipe(
          timeout(5000),
          catchError((error) => {
            console.error(
              `Error Login [correlationId: ${correlationId}]`,
              error,
            );
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

      return { ...result, correlationId };
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

  @Post(AUTH_ROUTES.RESET_PASSWORD_REQUEST)
  @ApiOperation({
    summary: 'Request for users who wants receive in email to change password',
  })
  @ApiCreatedResponse({
    description: 'On email was sent request to reset password',
    type: AuthEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  async requestResetPassword(@Body(EmailValidationPipe) emailDto: EmailDto) {
    try {
      const res = await lastValueFrom(
        this.apiService
          .send({ cmd: AUTH_SERVICE.RESET_REQUEST_PASSWORD }, emailDto.email)
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
  }

  @Post(AUTH_ROUTES.RESET_PASSWORD)
  @ApiOperation({
    summary: 'Request for users who wants receive in email to change password',
  })
  @ApiCreatedResponse({
    description: 'On email was sent request to reset password',
    type: AuthEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  async resetPassword(
    @Query('emailToken') emailToken: string,
    @Query('userId', ParseIntPipe) userId: number,

    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const payload = { userId, emailToken, resetPasswordDto };
    try {
      const res = await lastValueFrom(
        this.apiService
          .send({ cmd: AUTH_SERVICE.RESET_PASSWORD }, payload)
          .pipe(
            timeout(5000),
            catchError((error) => {
              console.error('Error Reset', error);
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
  }

  // @Get(AUTH_ROUTES.GOOGLE)
  // @ApiOperation({
  //   summary: 'Google log in for application ',
  // })
  // @ApiResponse({
  //   status: 302,
  //   description: 'Redirects to Google OAuth login',
  // })
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {}

  @Get(AUTH_ROUTES.GOOGLE_CALLBACK)
  @ApiOperation({ summary: 'Callback from Google OAuth' })
  @ApiResponse({
    status: 302,
    description: 'Sets cookie and redirects to frontend',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    try {
      // console.log(req.user);
      const user = await this.passportService.validateUser(req.user);

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const token = this.jwt.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
      });

      return res
        .cookie('jwtBooking', token, {
          httpOnly: true,
          sameSite: !isDevelopment ? 'lax' : 'strict',
          maxAge: 31 * 24 * 60 * 60 * 1000,
          secure: !isDevelopment,
        })
        .redirect('/');
    } catch (error) {
      console.error('Google Auth Error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadGatewayException(error.message || 'Authentication failed');
    }
  }

  @Get(AUTH_ROUTES.GITHUB_CALLBACK)
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Callback from Github OAuth' })
  @ApiResponse({
    status: 302,
    description: 'Sets cookie and redirects to frontend',
  })
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      // console.log(req.user);
      const user = await this.passportService.validateUser(req.user);

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const token = this.jwt.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
      });

      return res
        .cookie('jwtBooking', token, {
          httpOnly: true,
          sameSite: !isDevelopment ? 'lax' : 'strict',
          maxAge: 31 * 24 * 60 * 60 * 1000,
          secure: !isDevelopment,
        })
        .redirect('/');
    } catch (error) {
      console.error('Google Auth Error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadGatewayException(error.message || 'Authentication failed');
    }
  }

  @Get(AUTH_ROUTES.PING)
  async handleGet() {
    return this.apiService.send({ cmd: 'ping' }, {});
  }
}
