import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'AUTH_QUEUE',
      queueOptions: { durable: true },
    },
  });
  // const rmqService = app.get<RmqService>(RmqService);

  // app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // const configService = app.get(ConfigService);
  // await app.startAllMicroservices();
  await app.init();
}
bootstrap();
