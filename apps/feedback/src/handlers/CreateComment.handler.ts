import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../commands/CreateComment.command';
import { FeedbackRepository } from '@/libs/common/src';

@CommandHandler(CreateCommentCommand)
export class CreateCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async execute(command: CreateCommentCommand) {}
}
