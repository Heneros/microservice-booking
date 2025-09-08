import { AuthRepository, VerifyResetTokenRepository } from '@/app/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserCommand } from '../commands/LoginUser.command';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResendEmailHandler } from './ResendEmail.handler';
import { ResendEmailCommand } from '../commands/ResendEmail.command';
import * as crypto from 'crypto';

if (!(crypto as any).randomUUID) {
  (crypto as any).randomUUID = () => '00000000-0000-4000-8000-000000000000';
}

describe('resendEmail', () => {
  let handler: ResendEmailHandler;
  let authRepository: jest.Mocked<AuthRepository>;
  let verifyResetTokenRepository: jest.Mocked<VerifyResetTokenRepository>;

  let notificationsClient: {
    emit: jest.Mock;
  };

  beforeEach(() => {
    authRepository = {
      findByEmail: jest.fn(),
      updateProfile: jest.fn(),
    } as any;

    verifyResetTokenRepository = {
      createToken: jest.fn(),
      findUnique: jest.fn(),
      deleteToken: jest.fn(),
      updateToken: jest.fn(),
    } as any;

    notificationsClient = { emit: jest.fn() };

    handler = new ResendEmailHandler(
      notificationsClient as any,
      authRepository as any,
      verifyResetTokenRepository as any,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resend  email to user successfully', async () => {
    const email = 'test@example.com';
    const userId = 45;
    const user = {
      id: userId,
      email,
      username: 'Tester',
      isEmailVerified: false,
    } as any;
    const existingToken = {
      id: 1,
      userId,
      token: 'old-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      createdAt: new Date(Date.now()),
    };

    authRepository.findByEmail.mockResolvedValue(user);
    verifyResetTokenRepository.findUnique.mockResolvedValueOnce(existingToken);
    verifyResetTokenRepository.deleteToken.mockResolvedValueOnce(undefined);

    const createdToken = {
      id: 2,
      userId,
      token: 'new-token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    };
    verifyResetTokenRepository.createToken.mockResolvedValueOnce(createdToken);

    const result = await handler.execute(new ResendEmailCommand(email));

    expect(authRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(verifyResetTokenRepository.findUnique).toHaveBeenCalledWith({
      userId,
    });
    expect(verifyResetTokenRepository.deleteToken).toHaveBeenCalledWith(userId);
    expect(verifyResetTokenRepository.createToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        token: expect.any(String),
        tempDate: expect.anything(),
      }),
    );
    expect(notificationsClient.emit).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        user,
        template: expect.any(String),
        token: createdToken,
      }),
    );
    expect(result).toEqual({
      message: 'Email was successfully sent',
      status: 200,
    });
  });

  it('Throws NotFoundException when user not found', async () => {
    const email = 'notfound@example.com';
    authRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(
      handler.execute(new ResendEmailCommand(email)),
    ).rejects.toThrow(NotFoundException);
    expect(authRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(verifyResetTokenRepository.findUnique).not.toHaveBeenCalled();
    expect(notificationsClient.emit).not.toHaveBeenCalled();
  });

  it('Throws BadrequestException if user already verified found', async () => {
    const email = 'v@example.com';
    const user = { id: 1, email, isEmailVerified: true } as any;

    authRepository.findByEmail.mockResolvedValueOnce(user);
    await expect(
      handler.execute(new ResendEmailCommand(email)),
    ).rejects.toThrow(BadRequestException);

    expect(authRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(notificationsClient.emit).not.toHaveBeenCalled();
  });
  // it('Throws NotFoundException when user not found', async () => {
  //   const loginDto = {
  //     email: 'nonexistent@example.com',
  //     password: 'password123',
  //   };

  //   authRepository.findByEmail.mockResolvedValue(null);
  //   await expect(
  //     handler.execute(new LoginUserCommand(loginDto)),
  //   ).rejects.toThrow(NotFoundException);
  //   expect(authRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
  // });

  // it('Throws BadRequestException when password is invalid', async () => {
  //   const loginDto = {
  //     email: 'user@example.com',
  //     password: 'wrong_password',
  //   };

  //   const user = {
  //     id: 1,
  //     email: 'user@example.com',
  //     password: await bcrypt.hash('correct_password', 10),
  //     blocked: false,
  //     username: 'test_user',
  //     roles: ['user'],
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     isEmailVerified: true,
  //     avatarId: null,
  //     refreshToken: [],
  //     provider: 'local',
  //     googleId: null,
  //     githubId: null,
  //     discordId: null,
  //   };

  //   authRepository.findByEmail.mockResolvedValue(user);

  //   await expect(
  //     handler.execute(new LoginUserCommand(loginDto)),
  //   ).rejects.toThrow(BadRequestException);
  // });
});
