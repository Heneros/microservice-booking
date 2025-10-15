import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'notifications_queue',
        queueOptions: {
          durable: true,
          arguments: {
            'x-message-ttl': 60000,
            'x-dead-letter-exchange': 'dead_letter_exchange',
          },
        },
        prefetchCount: 5,
        noAck: false,
        exchange: 'events_exchange',
        exchangeType: 'topic',
        // persistent: true,
      },
    },
  );
  await app.listen();
}
bootstrap();
