import { Module } from '@nestjs/common';
import * as Repository from 'libs/common/src/repository';
import { UsersController } from './users.controller';

import {
  CommonModule,
  isDevelopment,
  PrismaService,
  RmqModule,
} from '@app/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { GetProfileUserHandler } from './handlers/GetProfile.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopment
        ? './apps/users/.env.development'
        : './apps/users/.env.prod',
    }),
    CqrsModule.forRoot({}),
    ClientsModule.register([
      {
        name: 'USERS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'users_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    GetProfileUserHandler,
    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,
    Repository.UserRepository,
  ],
})
export class UsersModule {}
