import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
// import { RabbitMqModule } from './rabbitmq-client/rabbitmq-client.module';
import { RabbitMqModule } from '@app/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RabbitMqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_API_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
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
