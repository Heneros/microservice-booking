import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AuthRepository,
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
import { GoogleService } from './auth/services/Google.service';
import { GoogleStrategy } from './auth/passport/GoogleStrategy';
import { HandleIOAuth } from './auth/passport/HandleOAuth';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './feedback/entities/Comment.entity';

@Module({
  imports: [
    RabbitMqModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isTest
        ? './apps/api-gateway/.env.test'
        : isDevelopment
          ? './apps/api-gateway/.env.development'
          : './apps/api-gateway/.env.prod',
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
    TypeOrmModule.forFeature([CommentEntity]),
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
    GoogleService,
    UserRepository,
    AuthRepository,
    VerifyResetTokenRepository,
    HandleIOAuth,
    GoogleStrategy,
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
