import { ICommand } from '@nestjs/cqrs';
import { LoginUserDto } from '@/app/common';

export class LoginUserCommand implements ICommand {
  constructor(public readonly logInDto: LoginUserDto) {}
}
