import { CustomRequest } from '@app/common';
import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';

export class LogoutCommand implements ICommand {
  constructor(
    public readonly req: CustomRequest,
    public readonly res: Response,
  ) {}
}
