import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { RmqModule, AuthModule, AUTH_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
// import { UsersModule } from 'apps/users/src/users.module';
// import { AuthModule } from 'apps/auth/src/auth.module';

import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // RmqModule.register({
    //   name: 'AUTH',
    // }),
    // RmqModule.register({
    //   name: 'USERS',
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_API_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'USERS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'users_queue',
          queueOptions: { durable: false },
        },
      },
    ]),

    // RmqModule.register({ name: AUTH_SERVICE.AUTH_MAIN }),
    // RmqModule.register({ name: 'USERS' }),
    // RmqModule,
    // AuthModule,
    // UsersModule,

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
      }),
      inject: [ConfigService],
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
