import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from '@/app/common';

export class RegisterUserCommand implements ICommand {
  constructor(public registerUserDto: RegisterUserDto) {}
}
