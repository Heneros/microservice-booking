import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries/GetUsers.query';
import { UserRepository } from '../repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(private readonly userRepository: UserRepository) {
  }
  async execute(query: FindAllUsersQuery) {
    const { page } = query;

    const allUsers = await this.userRepository.findAllUser(page);

    console.log(allUsers);
    if (allUsers.length === 0) {
      throw new NotFoundException('No users exist');
    }

    return allUsers;
  }
}
