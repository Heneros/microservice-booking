import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BadRequestException, Inject } from '@nestjs/common';
import {
  roundsOfHashing,
  tempRegisterDate,
} from '@/app/common/data/defaultData';

import { RegisterUserCommand } from '../commands/RegisterUser.command';
import {
  AuthRepository,
  NOTIFY_SERVICE,
  RedisPrefixEnum,
  VerifyResetTokenRepository,
} from '@/app/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisRepository } from '@/app/common/redis/redis.repository';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly authRepository: AuthRepository,
    private readonly verifyResetToken: VerifyResetTokenRepository,
    private readonly redisRepository: RedisRepository,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { registerUserDto } = command;


    if (registerUserDto.password !== registerUserDto.passwordConfirm) {
      throw new BadRequestException('Confirm password');
    }

    const userEmail = await this.authRepository.findByEmail(
      registerUserDto.email,
    );
    if (userEmail) {
      throw new BadRequestException('User already exists with this email');
   
    }

    const salt = await bcrypt.genSalt(roundsOfHashing);
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    const token = randomBytes(32).toString('hex');
    registerUserDto.password = hashedPassword;

    const userData = {
      username: registerUserDto.username,
      email: registerUserDto.email,
      password: hashedPassword,
    };

    const createdUser = await this.authRepository.create(userData);

    const userId = createdUser.id;

    const emailVerificationToken = await this.verifyResetToken.createToken({
      userId,
      token,
      tempDate: tempRegisterDate,
    });

    const data = {
      user: createdUser,
      title: 'Welcome to Booking App! Confirm your Email ',
      template: './confirmation',
      token: emailVerificationToken,
    };

    this.notificationsClient.emit(NOTIFY_SERVICE.NOTIFY_USER_REGISTER, data);

    await this.invalidateUserCaches();

    return {
      id: userId,
      email: registerUserDto.email,
      name: registerUserDto.username,
      accessToken: emailVerificationToken.token,
    };
  }

  private async invalidateUserCaches(): Promise<void> {
    try {
      const keysPattern = `${RedisPrefixEnum.USERS_LIST}:*`;
      await this.redisRepository.deleteByPattern(keysPattern);

      await this.redisRepository.deleteByPattern(
        `${RedisPrefixEnum.USERS_ID}:*`,
      );

      console.log('User caches invalidated successfully');
    } catch (error) {
      console.error('Error invalidating user caches:', error);
    }
  }
}
