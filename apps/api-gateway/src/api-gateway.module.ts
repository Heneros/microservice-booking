import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  isDevelopment,
  isTest,
  PrismaService,
  RabbitMqModule,
} from '@/app/common';

import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CloudinaryModule } from '@/app/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    RabbitMqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        // RABBIT_MQ_API_QUEUE: Joi.string().required(),
      }),
      envFilePath: isTest
        ? './apps/api-gateway/.env.test'
        : isDevelopment
          ? './apps/api-gateway/.env.development'
          : './apps/api-gateway/.env.prod',
    }),

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 180, limit: 25 }],
    }),
    PassportModule,
    CloudinaryModule,
  ],
  controllers: [ApiGatewayController, AuthController, UsersController],
  providers: [
    ApiGatewayService,
    PrismaService,
    // UserInterceptor,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserInterceptor,
    // },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class ApiGatewayModule {}
