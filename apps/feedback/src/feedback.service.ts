import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CommentEntity } from './entities/Comment.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class FeedbackService {
  // constructor(
  //   @InjectRepository(CommentEntity)
  //   private commentRepository: MongoRepository<CommentEntity>,
  // ) {}
  // createComment(data: any) {
  //   return this.commentRepository.save(data);
  // }
}
