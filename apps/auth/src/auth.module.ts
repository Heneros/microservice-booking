import { Module, Global } from '@nestjs/common';
import Joi from 'joi';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Repository from 'libs/common/src/repository';
import {
  AUTH_SERVICE,
  CommonModule,
  isDevelopment,
  JwtAuthGuard,
  PrismaService,
  RabbitMqModule,
  RmqService,
} from '@/app/common';

import { JwtModule } from '@nestjs/jwt';
import { RegisterUserHandler } from './handlers/RegisterUser.handler';
import { LoginUserHandler } from './handlers/LoginUser.handler';
import { LogoutHandler } from './handlers/Logout.handler';
import { VerifyUserHandler } from './handlers/VerifyUser.handler';
import { ResendEmailHandler } from './handlers/ResendEmail.handler';
import { ResetPasswordRequestHandler } from './handlers/RequestResetPassword.handler';
import { ResetPasswordHandler } from './handlers/ResetPassword.handler';
import { RedisRepository } from '@/app/common/redis/redis.repository';
import { RedisModule } from '@/app/common/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,

    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,

    RegisterUserHandler,
    LoginUserHandler,
    LogoutHandler,
    VerifyUserHandler,
    ResendEmailHandler,
    ResetPasswordRequestHandler,
    ResetPasswordHandler,
    // VerifyJWTService,

    // ...Object.values(Handlers),
    // ...Object.values(Repository),
    // ConfigService,
    RmqService,
    RedisRepository,
  ],
  imports: [
    ConfigModule,
    // CommonModule,

    RabbitMqModule,

    CqrsModule.forRoot({}),
    RedisModule,
    // RmqModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
