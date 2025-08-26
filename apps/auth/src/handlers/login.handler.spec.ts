
import { AuthRepository, VerifyResetTokenRepository } from '@/app/common';
import { RegisterUserCommand } from '../commands/RegisterUser.command';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserHandler } from './LoginUser.handler';
import { LoginUserCommand } from '../commands/LoginUser.command';
import bcrypt from 'bcryptjs';

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let authRepository: jest.Mocked<AuthRepository>;
  let verifyResetTokenRepository: jest.Mocked<VerifyResetTokenRepository>;

  // let authRepository: Partial<AuthRepository>;
  // let verifyResetTokenRepository: Partial<VerifyResetTokenRepository>;

  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    authRepository = {
      findByEmail: jest.fn(),
      updateProfile: jest.fn(),
    } as any;

    verifyResetTokenRepository = {
      createToken: jest.fn(),
      delete: jest.fn(),
      updateToken: jest.fn(),
    } as any;

    jwtService = {
      signAsync: jest.fn(),
    } as any;

    handler = new LoginUserHandler(
      authRepository,
      verifyResetTokenRepository,
      jwtService,
    );
  });

  it('should login successfully and return tokens + user', async () => {
    const command = new LoginUserCommand({
      email: 'test@example.com',
      password: '123456',
    });

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

    authRepository.findByEmail.mockResolvedValue(fakeUser);
    jwtService.signAsync.mockResolvedValueOnce('access-token');
    jwtService.signAsync.mockResolvedValueOnce('refresh-token');
    verifyResetTokenRepository.delete.mockResolvedValue(undefined);
    verifyResetTokenRepository.updateToken.mockResolvedValue(undefined);
    authRepository.updateProfile.mockResolvedValue(undefined);

    const result = await handler.execute(command);

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: fakeUser.id,
        username: fakeUser.username,
        email: fakeUser.email,
        roles: fakeUser.roles,
      },
    });

    expect(authRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(verifyResetTokenRepository.delete).toHaveBeenCalledWith({
      userId: 1,
    });
    expect(verifyResetTokenRepository.updateToken).toHaveBeenCalledWith(
      1,
      'refresh-token',
    );
    expect(authRepository.updateProfile).toHaveBeenCalledWith(1, {
      refreshToken: ['access-token'],
    });
  });
});
