import { NestFactory } from '@nestjs/core';
import { FeedbackModule } from './feedback.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(FeedbackModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'feedback_queue',
      queueOptions: { durable: true },
      prefetchCount: 5,
      noAck: false,
      exchange: 'app_change',
      exchangeType: 'direct',
      routingKey: 'feedback_commands',
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });
  await app.listen();
}
bootstrap();
