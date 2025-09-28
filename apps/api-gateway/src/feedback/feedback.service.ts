import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { CreateFeedback } from './dto/CreateFeedback.dto';

@Injectable()
export class FeedbackService {
  // constructor(
  //   @InjectRepository(CommentEntity)
  //   private commentRepository: MongoRepository<CommentEntity>,
  // ) {}
  // createComment(data: CreateFeedback) {
  //   const comment = this.commentRepository.create({
  //     ...data,
  //     createdAt: new Date(),
  //   });
  //   return this.commentRepository.save(comment);
  // }
}
