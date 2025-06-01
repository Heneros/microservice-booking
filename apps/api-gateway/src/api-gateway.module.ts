import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AuthModule } from 'apps/auth/src/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_API_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
    }),

    AuthModule,
  ],

  controllers: [ApiGatewayController, AuthController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
