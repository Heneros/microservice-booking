import { CreateCommentDto } from '@/libs/common/src/dtos';
import { ICommand } from '@nestjs/cqrs';

export class CreateCommentCommand implements ICommand {
  constructor(public commentData: CreateCommentDto) {}
}
