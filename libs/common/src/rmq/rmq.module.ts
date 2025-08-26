import { Module } from '@nestjs/common';
import { ClientsModule, Transport, ClientProviderOptions } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

const RMQ_CLIENTS_CONFIG: ClientProviderOptions[] = [
  {
    name: 'AUTH',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: false },
      prefetchCount: 1,
      noAck: true,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  },
  {
    name: 'USERS',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'users_queue',
      queueOptions: { durable: false },
      prefetchCount: 5,
      noAck: true,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  },
];

@Module({
  imports: [
    ClientsModule.register(RMQ_CLIENTS_CONFIG),
  ],
  controllers: [],
  providers: [RmqService],
  exports: [
    RmqService,
    ClientsModule.register(RMQ_CLIENTS_CONFIG),
  ],
})
export class RabbitMqModule {}