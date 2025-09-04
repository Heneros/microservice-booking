import { ICommand } from '@nestjs/cqrs';

export class ResendEmailCommand implements ICommand {
  constructor(public email: string) {}
}
