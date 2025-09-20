import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MongodbModule } from '@/libs/common/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/Comment.entity';

@Module({
  imports: [MongodbModule, TypeOrmModule.forFeature([CommentEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
