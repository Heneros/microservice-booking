import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../query/GetProfile.query';
import { UserRepository } from '@app/common';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(GetProfileQuery)
export class GetProfileUserHandler implements IQueryHandler<GetProfileQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetProfileQuery) {
    try {
      const { userId } = query;

      console.log(userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw error;
    }
  }
}
