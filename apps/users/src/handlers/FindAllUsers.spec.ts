import { AuthRepository, UserRepository } from '@/app/common';
import { FindAllUsersHandler } from './FindAllUsers.handler';
import bcrypt from 'bcryptjs';
import { FindAllUsersQuery } from '../query/FindAllUsers.query';
import { NotFoundException } from '@nestjs/common';
import { RedisService } from '@/app/common/redis/redis.service';

describe('FindAllUsersHandler', () => {
  let handler: FindAllUsersHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let redisService: jest.Mocked<RedisService>;
  beforeEach(() => {
    userRepository = {
      findAllUser: jest.fn(),
    } as any;

    handler = new FindAllUsersHandler(
      redisService as any,
      userRepository as any,
    );
  });

  it('FindAllUsers', async () => {
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

    userRepository.findAllUser.mockResolvedValue([fakeUser]);

    const res = await handler.execute(new FindAllUsersQuery(2));
    expect(res).toEqual([fakeUser]);
    expect(userRepository.findAllUser).toHaveBeenCalledWith(2);
  });
  it('throws NotFoundException when empty', async () => {
    userRepository.findAllUser.mockResolvedValue([]);

    await expect(handler.execute(new FindAllUsersQuery(2))).rejects.toThrow(
      NotFoundException,
    );

    expect(userRepository.findAllUser).toHaveBeenCalledWith(2);
  });
});
