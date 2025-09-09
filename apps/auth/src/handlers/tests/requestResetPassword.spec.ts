import { ResetPasswordHandler } from '../ResetPassword.handler';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedpwd'),
  compare: jest.fn(),
}));
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { ResetPasswordRequestHandler } from '../RequestResetPassword.handler';

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('test-token-hex')),


}));


if (!(crypto as any).randomUUID) {
  (crypto as any).randomUUID = () => '00000000-0000-4000-8000-000000000000';
}


import * as crypto from 'crypto';
import { ResetPasswordRequestCommand } from '../../commands/RequestResetPassword.command';

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordRequestHandler;

  let authRepository: {
    findById: jest.Mock;
    findByEmail: jest.Mock;
    updatePassword: jest.Mock;
  };
  let verifyResetTokenRepository: {
    findUnique: jest.Mock;
    createToken: jest.Mock;
     deleteToken: jest.Mock;
  };

  let notificationsClient: {
    emit: jest.Mock;
  };

  beforeEach(() => {
    notificationsClient = { emit: jest.fn() };
    verifyResetTokenRepository = {
      findUnique: jest.fn(),
      createToken:jest.fn(),
      deleteToken: jest.fn()
    };
    authRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updatePassword: jest.fn().mockResolvedValue(undefined),
    };

    handler = new ResetPasswordRequestHandler(
      notificationsClient as any,
      verifyResetTokenRepository as any,
      authRepository as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send Request password', async () => {
    const email = 'test@example.com';
    const userId = 1;

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

    // verifyResetTokenRepository.findUnique.mockResolvedValue()

    const existingToken = {
      id: 1,
      userId: userId,
      token: 'old-token',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    };

    const newToken = {
      id: 2,
      userId: userId,
      token: 'test-token-hex',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    };

    verifyResetTokenRepository.findUnique.mockResolvedValue({
      userId,
      token: 'abc',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    });

    authRepository.findByEmail.mockResolvedValue(user);
    verifyResetTokenRepository.findUnique.mockResolvedValue(existingToken);

    verifyResetTokenRepository.deleteToken.mockResolvedValue(undefined);
        verifyResetTokenRepository.createToken.mockResolvedValue(newToken);

    notificationsClient.emit.mockImplementation(() => {})


  const result = await handler.execute(new ResetPasswordRequestCommand(email));


  });

  // it('should send Request password', async () => {
  //   const userId = 42;
  //   const dto = { password: 'newpass', passwordConfirm: 'newpass' };
  //   const future = new Date(Date.now() + 1000 * 60 * 10);

  //   verifyResetTokenRepository.findUnique.mockResolvedValue({
  //     userId,
  //     token: 'abc',
  //     expiresAt: future,
  //     createdAt: new Date(),
  //   });

  //   const user = {
  //     id: userId,
  //     email: 'u@example.com',
  //     username: 'u',
  //     password: 'oldhash',
  //     blocked: false,
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
  //   authRepository.findById.mockResolvedValue(user);
  //   const result = await handler.execute(new ResetPasswordRequestCommand(userId, dto));
  //   expect(bcrypt.hash).toHaveBeenCalledWith('newpass', expect.any(Number));
  //   expect(authRepository.updatePassword).toHaveBeenCalledWith(
  //     user.id,
  //     'hashedpwd',
  //   );
  //   expect(notificationsClient.emit).toHaveBeenCalledTimes(1);
  //   expect.any(String),
  //     expect.objectContaining({
  //       user,
  //       subject: expect.any(String),
  //       template: expect.any(String),
  //     });
  //   expect(result).toEqual({
  //     message: 'Your password was reset successfully!',
  //   });
  // });

  // it("Passwords don't match ", async () => {
  //   const dto = { password: 'a', passwordConfirm: 'b' };
  //   const cmd = new ResetPasswordCommand(1, dto);

  //   await expect(handler.execute(cmd)).rejects.toThrow(BadRequestException);
  //   await expect(handler.execute(cmd)).rejects.toThrow('Password do not match');
  //   expect(verifyResetTokenRepository.findUnique).not.toHaveBeenCalled();
  //   expect(authRepository.findById).not.toHaveBeenCalled();
  //   expect(notificationsClient.emit).not.toHaveBeenCalled();
  // });

  // it('Throws  if BadRequestException, if token not exist', async () => {
  //   const dto = { password: 'a', passwordConfirm: 'a' };
  //   const cmd = new ResetPasswordCommand(5, dto);

  //   verifyResetTokenRepository.findUnique.mockResolvedValue(null);
  //   await expect(handler.execute(cmd)).rejects.toThrow(BadRequestException);

  //   await expect(handler.execute(cmd)).rejects.toThrow(
  //     'Your token is either invalid or expired. Try resetting your password again',
  //   );

  //   expect(authRepository.findById).not.toHaveBeenCalled();
  //   expect(notificationsClient.emit).not.toHaveBeenCalled();
  // });
});
