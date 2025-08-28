import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsModule, {
transport: Transport.RMQ,
options:{

    urls: ['amqp://user:password@rabbitmq:5672'],
    queue: 'notifications_queue',
         queueOptions: { durable: true },
                 prefetchCount: 5,
          noAck: false, 
          exchange: 'user_events',
          exchangeType: 'fanout',
                persistent: true,
        }
  });
  await app.listen();
}
bootstrap();
