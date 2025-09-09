import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { RegisterUserHandler } from '../RegisterUser.handler';
import {
  AuthRepository,
  NOTIFY_SERVICE,
  VerifyResetTokenRepository,
} from '@/app/common';
import { RegisterUserCommand } from '../../commands/RegisterUser.command';
import { BadRequestException } from '@nestjs/common';

const makeAuthRepoMock = () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
});

const makeVerifyResetTokenRepoMock = () => ({
  createToken: jest.fn(),
});

const makeNotificationsClientMock = () => ({
  emit: jest.fn(),
});

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let authRepository: ReturnType<typeof makeAuthRepoMock>;
  let verifyResetTokenRepository: ReturnType<
    typeof makeVerifyResetTokenRepoMock
  >;
  let notificationsClient: ReturnType<typeof makeNotificationsClientMock>;

  beforeEach(() => {
    authRepository = makeAuthRepoMock();
    verifyResetTokenRepository = makeVerifyResetTokenRepoMock();
    notificationsClient = makeNotificationsClientMock();

    handler = new RegisterUserHandler(
      notificationsClient as any,
      authRepository as any,
      verifyResetTokenRepository as any,
    );
  });

  it('should create a user successfully', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (authRepository.create as jest.Mock).mockResolvedValue({
      id: 1,
      username: 'John',
      email: 'john@example.com',
    });

    (verifyResetTokenRepository.createToken as jest.Mock).mockResolvedValue({
      token: 'test-token',
    });

    const command = new RegisterUserCommand({
      username: 'John',
      email: 'john@example.com',
      password: '123456',
      passwordConfirm: '123456',
    });

    const result = await handler.execute(command);

    expect(result).toEqual({
      id: 1,
      email: 'john@example.com',
      name: 'John',
      accessToken: 'test-token',
    });

    expect(notificationsClient.emit).toHaveBeenCalledTimes(1);
    const [eventName, payload] = (notificationsClient.emit as jest.Mock).mock
      .calls[0];
    expect(eventName).toBe(NOTIFY_SERVICE.NOTIFY_USER_REGISTER);
    expect(payload).toMatchObject({
      user: expect.objectContaining({ id: 1, email: 'john@example.com' }),
      template: expect.any(String),
      token: expect.objectContaining({ token: 'test-token' }),
    });
  });

  it('should throw if passwords do not match', async () => {
    const command = new RegisterUserCommand({
      username: 'John',
      email: 'john@example.com',
      password: '123',
      passwordConfirm: '456',
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);

    expect(authRepository.findByEmail).not.toHaveBeenCalled();
    expect(verifyResetTokenRepository.createToken).not.toHaveBeenCalled();
    expect(notificationsClient.emit).not.toHaveBeenCalled();
  });
});
