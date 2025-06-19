import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { UsersModule } from 'apps/users/src/users.module';
import { AuthModule } from 'apps/auth/src/auth.module';

import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
    RmqModule.register({
      name: 'USERS',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_API_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
    }),

    AuthModule,
    UsersModule,
  ],

  controllers: [ApiGatewayController, AuthController, UsersController],
  providers: [
    ApiGatewayService,
    // UserInterceptor,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserInterceptor,
    // },
  ],
})
export class ApiGatewayModule {}
