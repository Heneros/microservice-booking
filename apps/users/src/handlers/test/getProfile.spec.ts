import { AuthRepository, RedisPrefixEnum, UserRepository } from '@/app/common';
import bcrypt from 'bcryptjs';

import { NotFoundException } from '@nestjs/common';
import { RedisRepository } from '@/app/common/redis/redis.repository';
import { CACHE_TTL } from '@/app/common/data/ttl';
import { GetProfileUserHandler } from '../GetProfile.handler';
import { GetProfileQuery } from '../../query/GetProfile.query';

describe('GetProfileUserHandler', () => {
  let handler: GetProfileUserHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let redisRepository: jest.Mocked<RedisRepository>;

  beforeEach(() => {
    redisRepository = {
      get: jest.fn(),
      set: jest.fn(),
      flushAll: jest.fn(),
    } as any;

    userRepository = {
      findById: jest.fn(),
    } as any;

    handler = new GetProfileUserHandler(
      redisRepository as any,
      userRepository as any,
    );
  });

  it('GetProfileUserHandler - should return user from cache if available', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      username: 'Tester',
      password: await bcrypt.hash('123456', 10),
      blocked: false,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
      avatarId: 0,
      refreshToken: [],
      provider: 'local',
      googleId: '',
      githubId: '',
      discordId: '',
    };

    redisRepository.get.mockResolvedValue([fakeUser]);

    const res = await handler.execute(new GetProfileQuery(1));

    expect(res).toEqual([fakeUser]);
    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_ID,
      '1',
    );

    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('findByIds - should return user from database and cache them', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      username: 'Tester',
      password: await bcrypt.hash('123456', 10),
      blocked: false,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
      avatarId: 0,
      refreshToken: [],
      provider: 'local',
      googleId: '',
      githubId: '',
      discordId: '',
    };
    redisRepository.get.mockResolvedValue(null);
    userRepository.findById.mockResolvedValue(fakeUser);
    redisRepository.set.mockResolvedValue(undefined);

    const res = await handler.execute(new GetProfileQuery(2));
    expect(res).toEqual(fakeUser);

    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_ID,
      '2',
    );

    expect(userRepository.findById).toHaveBeenCalledWith(2);
    expect(redisRepository.set).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_ID,
      '2',
      fakeUser,
      CACHE_TTL.HALF_HOUR,
    );
  });

  it('throws NotFoundException when no users found in database', async () => {
    redisRepository.get.mockResolvedValue(null);
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(new GetProfileQuery(2))).rejects.toThrow(
      NotFoundException,
    );

    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_ID,
      '2',
    );
    expect(userRepository.findById).toHaveBeenCalledWith(2);
    expect(redisRepository.set).not.toHaveBeenCalled();
  });
});
