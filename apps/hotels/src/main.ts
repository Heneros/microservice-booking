import { NestFactory } from '@nestjs/core';
import { HotelsModule } from './hotels.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(HotelsModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'hotels_queue',
      queueOptions: { durable: true },
      prefetchCount: 5,
      noAck: false,
      exchange: 'app_change',
      exchangeType: 'direct',
      routingKey: 'hotels_commands',
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });
  await app.listen();
}
bootstrap();
