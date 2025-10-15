import { AuthRepository, VerifyResetTokenRepository } from '@/app/common';

import { ResetPasswordHandler } from '../ResetPassword.handler';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedpwd'),
  compare: jest.fn(),
}));
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../../commands/ResetPassword.command';
import { BadRequestException } from '@nestjs/common';

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordHandler;

  let authRepository: {
    findById: jest.Mock;
    updatePassword: jest.Mock;
  };
  let verifyResetTokenRepository: {
    findUnique: jest.Mock;
  };

  let notificationsClient: {
    emit: jest.Mock;
  };

  beforeEach(() => {
    notificationsClient = { emit: jest.fn() };
    verifyResetTokenRepository = {
      findUnique: jest.fn(),
    };
    authRepository = {
      findById: jest.fn(),
      updatePassword: jest.fn().mockResolvedValue(undefined),
    };

    handler = new ResetPasswordHandler(
      notificationsClient as any,
      verifyResetTokenRepository as any,
      authRepository as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update password', async () => {
    const userId = 42;
    const dto = { password: 'newpass', passwordConfirm: 'newpass' };
    const future = new Date(Date.now() + 1000 * 60 * 10);

    verifyResetTokenRepository.findUnique.mockResolvedValue({
      userId,
      token: 'abc',
      expiresAt: future,
      createdAt: new Date(),
    });

    const user = {
      id: userId,
      email: 'u@example.com',
      username: 'u',
      password: 'oldhash',
      blocked: false,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
      avatarId: null,
      refreshToken: [],
      provider: 'local',
      googleId: null,
      githubId: null,
      discordId: null,
    };
    authRepository.findById.mockResolvedValue(user);
    const result = await handler.execute(new ResetPasswordCommand(userId, dto));
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', expect.any(Number));
    expect(authRepository.updatePassword).toHaveBeenCalledWith(
      user.id,
      'hashedpwd',
    );
    expect(notificationsClient.emit).toHaveBeenCalledTimes(1);
    expect.any(String),
      expect.objectContaining({
        user,
        subject: expect.any(String),
        template: expect.any(String),
      });
    expect(result).toEqual({
      message: 'Your password was reset successfully!',
    });
  });

  it("Passwords don't match ", async () => {
    const dto = { password: 'a', passwordConfirm: 'b' };
    const cmd = new ResetPasswordCommand(1, dto);

    await expect(handler.execute(cmd)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(cmd)).rejects.toThrow('Password do not match');
    expect(verifyResetTokenRepository.findUnique).not.toHaveBeenCalled();
    expect(authRepository.findById).not.toHaveBeenCalled();
    expect(notificationsClient.emit).not.toHaveBeenCalled();
  });

  it('Throws  if BadRequestException, if token not exist', async () => {
    const dto = { password: 'a', passwordConfirm: 'a' };
    const cmd = new ResetPasswordCommand(5, dto);

    verifyResetTokenRepository.findUnique.mockResolvedValue(null);
    await expect(handler.execute(cmd)).rejects.toThrow(BadRequestException);

    await expect(handler.execute(cmd)).rejects.toThrow(
      'Your token is either invalid or expired. Try resetting your password again',
    );

    expect(authRepository.findById).not.toHaveBeenCalled();
    expect(notificationsClient.emit).not.toHaveBeenCalled();
  });
});
