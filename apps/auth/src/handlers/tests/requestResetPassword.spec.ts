import { BadRequestException } from '@nestjs/common';
import { ResetPasswordRequestCommand } from '../../commands/RequestResetPassword.command';
import { ResetPasswordRequestHandler } from '../RequestResetPassword.handler';

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('test-token-hex')),
  randomUUID: jest.fn().mockReturnValue('00000000-0000-4000-8000-000000000000'),
}));

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordRequestHandler;

  let authRepository: {
    findById: jest.Mock;
    findByEmail: jest.Mock;
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
      createToken: jest.fn(),
      deleteToken: jest.fn(),
    };
    authRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    handler = new ResetPasswordRequestHandler(
      notificationsClient as any,
      authRepository as any,
      verifyResetTokenRepository as any,
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
      email: email,
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
      token: '746573742d746f6b656e2d686578',
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

    notificationsClient.emit.mockImplementation(() => {});

    const result = await handler.execute(
      new ResetPasswordRequestCommand(email),
    );

    expect(verifyResetTokenRepository.findUnique).toHaveBeenCalledWith({
      userId: user.id,
    });
    expect(verifyResetTokenRepository.deleteToken).toHaveBeenCalledWith(
      user.id,
    );

    expect(verifyResetTokenRepository.createToken).toHaveBeenCalledWith({
      userId: user.id,
      token: '746573742d746f6b656e2d686578',
      tempDate: expect.any(Date),
    });
    expect(notificationsClient.emit).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Email was successfully sent',
      status: 200,
    });
  });

  it('should throw BadRequestException when user not found', async () => {
    const email = 'nonexistent@example.com';

    authRepository.findByEmail.mockResolvedValue(null);

    await expect(
      handler.execute(new ResetPasswordRequestCommand(email)),
    ).rejects.toThrow(BadRequestException);
    await expect(
      handler.execute(new ResetPasswordRequestCommand(email)),
    ).rejects.toThrow('No user exist');
    expect(authRepository.findByEmail).toHaveBeenCalledWith(email);

    expect(verifyResetTokenRepository.findUnique).not.toHaveBeenCalled();
  });
});
