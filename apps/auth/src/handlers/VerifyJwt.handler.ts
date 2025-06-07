import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyJwtCommand } from '../commands/VerifyJwt.command';

@CommandHandler(VerifyJwtCommand)
export class VerifyJwtHandler implements ICommandHandler<VerifyJwtCommand> {
  constructor() {}

  async execute(command: VerifyJwtCommand) {}
}
