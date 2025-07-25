import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { CommonModule, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { UsersModule } from 'apps/users/src/users.module';
import { AuthModule } from 'apps/auth/src/auth.module';

import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CommonModule,
    //   ClientsModule.register([
    //   {
    //     name: 'AUTH',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBITMQ_URI],
    //       queue: 'AUTH_QUEUE',
    //       queueOptions: { durable: true },
    //     },
    //   },
    //   {
    //     name: 'USERS',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBITMQ_URI],
    //       queue: 'USERS_QUEUE',
    //       queueOptions: { durable: true },
    //     },
    //   },
    // ]),
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

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        // secret: configService.get<string>('JWT_SECRET'),
        // secret: configService.get('JWT_SECRET'),
        secret: process.env.JWT_SECRET,
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
        signOptions: { expiresIn: '31d' },
      }),
    }),
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
