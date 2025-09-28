import { ICommand } from '@nestjs/cqrs';

export class CreateCommentCommand implements ICommand {
  constructor() {}
}
