import { Module, Global } from '@nestjs/common';
import Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Repository from 'libs/common/src/repository';
import {
  AUTH_SERVICE,
  CommonModule,
  isDevelopment,
  JwtAuthGuard,
  PrismaService,
  RmqService,
} from '@/app/common';

import { JwtModule } from '@nestjs/jwt';
import { RegisterUserHandler } from './handlers/RegisterUser.handler';
import { LoginUserHandler } from './handlers/LoginUser.handler';
import { VerifyJWTService } from './services/verifyJwt.service';
import { JwtStrategy } from './jwt-strategy';
import { JwtGuard } from './guards/jwt.guard';
import { LogoutHandler } from './handlers/Logout.handler';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    // JwtAuthGuard,
    // RegisterUserHandler,
    JwtGuard,
    JwtStrategy,
    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,

    RegisterUserHandler,
    LoginUserHandler,
    LogoutHandler,
    VerifyJWTService,
    // ...Object.values(Handlers),
    // ...Object.values(Repository),

    RmqService,
    // LocalSt
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_MAIN_QUEUE: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: isDevelopment
        ? './apps/auth/.env.development'
        : './apps/auth/.env.prod',
    }),
    // CommonModule,
    // RmqModule,
    CqrsModule.forRoot({}),

    // RmqModule,
    JwtModule.registerAsync({
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
