import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { isDevelopment, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { UsersModule } from 'apps/users/src/users.module';
import { AuthModule } from 'apps/auth/src/auth.module';

import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

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
      envFilePath: isDevelopment
        ? './apps/api-gateway/.env'
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
