import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../query/GetProfile.query';
import { RedisPrefixEnum, UserRepository } from '@/app/common';
import {
  BadRequestException,
  HttpException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from '@/app/common/redis/redis.service';
import { RedisRepository } from '@/app/common/redis/redis.repository';
import { CACHE_TTL } from '@/app/common/data/ttl';

@QueryHandler(GetProfileQuery)
export class GetProfileUserHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetProfileQuery) {
    try {
      const { userId } = query;

      const start = performance.now();
      const userCached = await this.redisRepository.get(
        RedisPrefixEnum.USERS_ID,
        String(userId),
      );

      //  console.log('userId32', userId);
      if (userCached) {
        // console.log(
        //   'Cache Hit35:',
        //   (performance.now() - start).toFixed(2),
        //   'ms',
        // );
        return userCached;
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('No user found');
      }

      // console.log('query', query);

      // await this.redisService.saveUser(Number(user.id), user);
      await this.redisRepository.set(
        RedisPrefixEnum.USERS_ID,
        String(userId),
        user,
        CACHE_TTL.HALF_HOUR,
      );
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || HttpException) {
        throw error;
      }

      throw error;
    }
  }
}
