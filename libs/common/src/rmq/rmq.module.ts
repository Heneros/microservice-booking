import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
          prefetchCount: 5,
          noAck: true,
          // persistent: true,
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
          // persistent: false,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RmqService],
  exports: [
    RmqService,
    ClientsModule.register([
      {
        name: 'AUTH',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
          prefetchCount: 5,
          noAck: true,
          // persistent: true,
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
          noAck: false,
          // persistent: false,
        },
      },
    ]),
  ],
})
export class RabbitMqModule {}
