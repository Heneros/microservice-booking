import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHotelCommand } from '../commands/CreateHotel.command';

@CommandHandler(CreateHotelCommand)
export class CreateHotelHandler implements ICommandHandler<CreateHotelCommand> {
  constructor() {}

  async execute(command: CreateHotelCommand) {}
}
