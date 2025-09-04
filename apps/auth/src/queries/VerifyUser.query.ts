import { IQuery } from '@nestjs/cqrs';

export class VerifyUserQuery implements IQuery {
  constructor(
    public readonly token: string,
    public readonly userId: number,
  ) {}
}
