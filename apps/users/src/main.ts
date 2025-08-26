import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { RmqService } from '@/app/common';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'users_queue',
        queueOptions: { durable: true },
      prefetchCount: 1,
   noAck: false,
   persistent: true,
              exchange: 'app_change',
      exchangeType: 'direct',
           routingKey: 'users_commands',
      //         socketOptions: {
      //   heartbeatIntervalInSeconds: 60,
      //   reconnectTimeInSeconds: 5,
      // },
        // persistent: false,
      },
    },
  );


  await app.listen();
}
bootstrap();
