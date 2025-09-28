import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import {
  MongodbModule,
  PrismaService,
  RabbitMqModule,
  RmqService,
} from '@/libs/common/src';
import * as Handlers from './handlers/index';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/Comment.entity';
import { RedisRepository } from '@/libs/common/src/redis/redis.repository';
import { RedisModule } from '@/libs/common/src/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
// import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ConfigModule.forRoot({}),
    MongodbModule,
    TypeOrmModule.forFeature([CommentEntity]),
    RabbitMqModule,
    RedisModule,
    CqrsModule.forRoot({}),
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    PrismaService,
    RmqService,
    RedisRepository,
    ...Object.values(Handlers),
  ],
})
export class FeedbackModule {}
