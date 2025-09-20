import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: true },
        prefetchCount: 5,
        noAck: false,
        exchange: 'app_change',
        exchangeType: 'direct',
        routingKey: 'auth_commands',
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
