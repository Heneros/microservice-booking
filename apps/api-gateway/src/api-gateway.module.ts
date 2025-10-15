import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AuthRepository,
  Comments,
  isDevelopment,
  isTest,
  MongodbModule,
  PrismaService,
  RabbitMqModule,
  UserRepository,
  VerifyResetTokenRepository,
} from '@/app/common';

import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CloudinaryModule } from '@/app/common/cloudinary/cloudinary.module';
import { PassportService } from './auth/services/Passport.service';
import { GoogleStrategy } from './auth/passport/GoogleStrategy';
import { HandleIOAuth } from './auth/services/HandleOAuth.service';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { GithubStrategy } from './auth/passport/GithubStrategy';

@Module({
  imports: [
    RabbitMqModule,

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_MAIN_QUEUE: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: path.resolve(
        process.cwd(),
        isDevelopment ? '.env' : '.env.prod',
      ),
      // envFilePath: isDevelopment ? '.env' : '.env.prod',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '31d' },
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
      }),
      inject: [ConfigService],
    }),
    MongodbModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 180, limit: 25 }],
    }),
    TypeOrmModule.forFeature([Comments]),
    PassportModule,
    CloudinaryModule,
  ],
  controllers: [
    ApiGatewayController,
    AuthController,
    UsersController,
    FeedbackController,
  ],
  providers: [
    ApiGatewayService,
    PrismaService,
    PassportService,
    UserRepository,
    AuthRepository,
    VerifyResetTokenRepository,
    HandleIOAuth,
    GoogleStrategy,
    GithubStrategy,
    FeedbackService,

    // UserInterceptor,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserInterceptor,
    // },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class ApiGatewayModule {}
