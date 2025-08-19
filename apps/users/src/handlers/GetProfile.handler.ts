import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../query/GetProfile.query';
import { UserRepository } from '@/app/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetProfileQuery)
export class GetProfileUserHandler implements IQueryHandler<GetProfileQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetProfileQuery) {
    try {
      const { userId } = query;
      //  console.log('userId32', userId);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('No user found');
      }

      // console.log('query', query);

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw error;
    }
  }
}
