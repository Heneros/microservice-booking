import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VerifyUserQuery } from '../queries/VerifyUser.query';
import { VerifyUserHandler } from './VerifyUser.handler';

const makeAuthRepoMock = () => ({
  findById: jest.fn(),
  verifyUser: jest.fn(),
});
const makeVerifyResetTokenRepoMock = () => ({
  findTokenByTokenValue: jest.fn(),
  updateToken: jest.fn(),
});

const makeNotificationsClientMock = () => ({
  emit: jest.fn(),
});

describe('VerifyUser', () => {
  let handler: VerifyUserHandler;
  let authRepository: ReturnType<typeof makeAuthRepoMock>;
  let verifyResetTokenRepository: ReturnType<
    typeof makeVerifyResetTokenRepoMock
  >;
  let notificationsClient: ReturnType<typeof makeNotificationsClientMock>;

  beforeEach(() => {
    authRepository = makeAuthRepoMock();
    verifyResetTokenRepository = makeVerifyResetTokenRepoMock();
    notificationsClient = makeNotificationsClientMock();

    handler = new VerifyUserHandler(
      notificationsClient as any,

      verifyResetTokenRepository as any,
      authRepository as any,
    );
  });

  it('It should verify email user', async () => {
    const mockUser = {
      id: 123,
      isEmailVerified: false,
    };
    const mockToken = {
      token: '12qw',
      expiresAt: new Date(Date.now() + 3600000),
      userId: 123,
    };

    (authRepository.findById as jest.Mock).mockResolvedValue(mockUser);

    (
      verifyResetTokenRepository.findTokenByTokenValue as jest.Mock
    ).mockResolvedValue(mockToken);
    (authRepository.verifyUser as jest.Mock).mockResolvedValue(undefined);
    (verifyResetTokenRepository.updateToken as jest.Mock).mockResolvedValue(
      undefined,
    );
    (notificationsClient.emit as jest.Mock).mockImplementation(() => {});

    const query = new VerifyUserQuery('12qw', 123);
    const result = await handler.execute(query);
    expect(result).toEqual({
      id: 123,
      message: 'Your email is verified!',
    });

    expect(authRepository.findById).toHaveBeenCalledWith(123);
    expect(
      verifyResetTokenRepository.findTokenByTokenValue,
    ).toHaveBeenCalledWith('12qw');
    expect(authRepository.verifyUser).toHaveBeenCalledWith(123);
    expect(verifyResetTokenRepository.updateToken).toHaveBeenCalledWith(
      123,
      '12qw',
    );
    expect(notificationsClient.emit).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found', async () => {
    (authRepository.findById as jest.Mock).mockResolvedValue(null);
    const query = new VerifyUserQuery('123q2', 123);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(query)).rejects.toThrow('User not found');
  });

  it('should throw BadRequestException if email already verified', async () => {
    const mockUser = {
      id: 123,
      isEmailVerified: true,
    };

    (authRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    const query = new VerifyUserQuery('12qw', 123);
    await expect(handler.execute(query)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(query)).rejects.toThrow(
      'Email already verified',
    );
  });

  it('should throw BadRequestException if token expired', async () => {
    const mockUser = {
      id: 123,
      isEmailVerified: false,
    };
    const mockToken = {
      token: '12qw',
      expiresAt: new Date(Date.now() - 3600000),
      userId: 123,
    };

    (authRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    (
      verifyResetTokenRepository.findTokenByTokenValue as jest.Mock
    ).mockResolvedValue(mockToken);
    const query = new VerifyUserQuery('12qw', 123);
    await expect(handler.execute(query)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(query)).rejects.toThrow(
      'Expired token or invalid token',
    );
  });
});
