import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from '../../../../libs/common/src/dtos';

export class RegisterUserCommand implements ICommand {
  constructor(public registerUserDto: RegisterUserDto) {}
}
