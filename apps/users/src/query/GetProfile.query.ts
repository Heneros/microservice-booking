import { IQuery } from '@nestjs/cqrs';

export class GetProfileQuery implements IQuery {
  constructor(public userId: number) {}
}
