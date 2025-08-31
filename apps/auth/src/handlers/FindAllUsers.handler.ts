import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries/GetUsers.query';
import { UserRepository } from '@/app/common';
import { Inject, NotFoundException } from '@nestjs/common';
import { RedisService } from '@/app/common/redis/redis.service';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {}
  async execute(query: FindAllUsersQuery) {
    const { page } = query;

    const allUsers = await this.userRepository.findAllUser(page);

    // console.log(allUsers);
    if (allUsers.length === 0) {
      throw new NotFoundException('No users exist');
    }

    return allUsers;
  }
}
