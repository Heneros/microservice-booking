import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { RmqService } from '@app/common';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  /// const app = await NestFactory.create(UsersModule);
  // const rmqService = app.get<RmqService>(RmqService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'USERS_QUEUE',
      queueOptions: { durable: true },
    },
  });
  // app.connectMicroservice<RmqOptions>(rmqService.getOptions('USERS'));

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
  // await app.startAllMicroservices();
  await app.init();
}
bootstrap();
