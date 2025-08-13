import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { AUTH_SERVICE, RmqService } from '@app/common';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const app = await NestFactory.create(AuthModule);
  // const configService = app.get(ConfigService);
  // const rmqService = app.get<RmqService>(RmqService);

  // app.use(cookieParser());

  // app.connectMicroservice<RmqOptions>(
  //   rmqService.getOptions(AUTH_SERVICE.AUTH_MAIN, false),
  // );

  // await app.startAllMicroservices();
  // await app.listen(3001);
  // await app.init();

  // console.log(`Auth service started on port ${configService.get('PORT')}`);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
}
bootstrap();
