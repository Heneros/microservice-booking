import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
// import { FeedbackService } from './feedback.service';
import {
  Comments,
  isDevelopment,
  MongodbModule,
  PrismaService,
  RabbitMqModule,
  RmqService,
} from '@/libs/common/src';
import * as Repository from 'libs/common/src/repository';

import * as Handlers from './handlers/index';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisRepository } from '@/libs/common/src/redis/redis.repository';
import { RedisModule } from '@/libs/common/src/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongodbModule,
    TypeOrmModule.forFeature([Comments]),
    RabbitMqModule,
    RedisModule,
    CqrsModule.forRoot({}),
  ],
  controllers: [FeedbackController],
  providers: [
    PrismaService,
    RmqService,

    Repository.FeedbackRepository,
    RedisRepository,
    ...Object.values(Handlers),
  ],
})
export class FeedbackModule {}
