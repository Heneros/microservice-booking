import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from '../dto';

export class RegisterUserCommand implements ICommand {
  constructor(public registerUserDto: RegisterUserDto) {}
}
