import { ResetPasswordDto } from '@/app/common';
import { ICommand } from '@nestjs/cqrs';

export class ResetPasswordCommand implements ICommand {
  constructor(
    public userId: number,
    public resetPasswordDto: ResetPasswordDto,
  ) {}
}
