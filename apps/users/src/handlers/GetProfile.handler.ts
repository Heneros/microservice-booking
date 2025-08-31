import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../query/GetProfile.query';
import { UserRepository } from '@/app/common';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { RedisService } from '@/app/common/redis/redis.service';

@QueryHandler(GetProfileQuery)
export class GetProfileUserHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetProfileQuery) {
    try {
      const { userId } = query;

      const start = performance.now();
      const userCached = await this.redisService.getProfile(Number(userId));
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

      await this.redisService.saveUser(Number(user.id), user);

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw error;
    }
  }
}
