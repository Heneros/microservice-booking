import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../query/FindAllUsers.query';
import { RedisPrefixEnum, UserRepository } from '@/app/common';
import { Inject, NotFoundException } from '@nestjs/common';

import { RedisRepository } from '@/app/common/redis/redis.repository';
import { CACHE_TTL } from '@/app/common/data/ttl';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async execute(query: FindAllUsersQuery) {
    const { page } = query;

    // const key =  `${RedisPrefixEnum.USERS_LIST}:${page}`
    const cached = await this.redisRepository.get(
      RedisPrefixEnum.USERS_LIST,
      String(page),
    );

    /// const start = Date.now();
    if (cached) {
      // const end = Date.now();

      // console.log(`Cache HIT for page ${page}, took ${end - start}ms`);
      return cached;
    }

    const allUsers = await this.userRepository.findAllUser(page);

    // console.log(allUsers);
    if (allUsers.length === 0) {
      throw new NotFoundException('No users exist');
    }

    await this.redisRepository.set(
      RedisPrefixEnum.USERS_LIST,
      String(page),
      allUsers,
      CACHE_TTL.HALF_HOUR,
    );

    return allUsers;
  }
}
