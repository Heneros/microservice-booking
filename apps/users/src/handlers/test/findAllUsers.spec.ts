import { AuthRepository, RedisPrefixEnum, UserRepository } from '@/app/common';
import { FindAllUsersHandler } from './FindAllUsers.handler';
import bcrypt from 'bcryptjs';
import { FindAllUsersQuery } from '../query/FindAllUsers.query';
import { NotFoundException } from '@nestjs/common';
import { RedisRepository } from '@/app/common/redis/redis.repository';
import { CACHE_TTL } from '@/app/common/data/ttl';

describe('FindAllUsersHandler', () => {
  let handler: FindAllUsersHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let redisRepository: jest.Mocked<RedisRepository>;

  beforeEach(() => {
    redisRepository = {
      get: jest.fn(),
      set: jest.fn(),
      flushAll: jest.fn(),
    } as any;

    userRepository = {
      findAllUser: jest.fn(),
    } as any;

    handler = new FindAllUsersHandler(
      redisRepository as any,
      userRepository as any,
    );
  });

  it('FindAllUsers - should return users from cache if available', async () => {
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

    const res = await handler.execute(new FindAllUsersQuery(2));

    expect(res).toEqual([fakeUser]);
    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_LIST,
      '2',
    );

    expect(userRepository.findAllUser).not.toHaveBeenCalled();
  });

  it('FindAllUsers - should return users from database and cache them', async () => {
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
    userRepository.findAllUser.mockResolvedValue([fakeUser]);
    redisRepository.set.mockResolvedValue(undefined);

    const res = await handler.execute(new FindAllUsersQuery(2));
    expect(res).toEqual([fakeUser]);

    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_LIST,
      '2',
    );

    expect(userRepository.findAllUser).toHaveBeenCalledWith(2);
    expect(redisRepository.set).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_LIST,
      '2',
      [fakeUser],
      CACHE_TTL.HALF_HOUR,
    );
  });

  it('throws NotFoundException when no users found in database', async () => {
    redisRepository.get.mockResolvedValue(null);
    userRepository.findAllUser.mockResolvedValue([]);

    await expect(handler.execute(new FindAllUsersQuery(2))).rejects.toThrow(
      NotFoundException,
    );

    expect(redisRepository.get).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS_LIST,
      '2',
    );
    expect(userRepository.findAllUser).toHaveBeenCalledWith(2);
    expect(redisRepository.set).not.toHaveBeenCalled();
  });
});
