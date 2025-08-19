import { RmqContext } from '@nestjs/microservices';
import { RegisterUserHandler } from './RegisterUser.handler';
import { CommandBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { AuthRepository, VerifyResetTokenRepository } from '@/app/common';
import { RegisterUserCommand } from '../commands/RegisterUser.command';
import { BadRequestException } from '@nestjs/common';

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let commandBus: Partial<CommandBus>;
  let authRepository: Partial<AuthRepository>;
  let verifyResetToken: Partial<VerifyResetTokenRepository>;

  let rmqService: any;

  beforeEach(() => {
    authRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    verifyResetToken = {
      createToken: jest.fn(),
    };

    handler = new RegisterUserHandler(
      authRepository as any,
      verifyResetToken as any,
    );
  });

  it('should create a user successfully', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (authRepository.create as jest.Mock).mockResolvedValue({ id: 1 });
    (verifyResetToken.createToken as jest.Mock).mockResolvedValue({
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
  });
  it('should throw if passwords do not match', async () => {
    const command = new RegisterUserCommand({
      username: 'John',
      email: 'john@example.com',
      password: '123',
      passwordConfirm: '456',
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });
});
