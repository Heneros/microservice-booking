import { MongodbModule, PrismaService, RmqService } from '@/libs/common/src';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { CommentEntity } from './entities/Comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    // ConfigModule.forRoot({}),
  ],
  controllers: [FeedbackController],
  providers: [],
})
export class FeedbackModule {}
