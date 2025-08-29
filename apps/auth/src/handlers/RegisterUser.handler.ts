import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BadRequestException, Inject } from '@nestjs/common';
import {
  roundsOfHashing,
  tempRegisterDate,
} from '@/app/common/data/defaultData';

import { RegisterUserCommand } from '../commands/RegisterUser.command';
import { AuthRepository, VerifyResetTokenRepository } from '@/app/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly authRepository: AuthRepository,
    private readonly verifyResetToken: VerifyResetTokenRepository,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { registerUserDto } = command;

    if (registerUserDto.password !== registerUserDto.passwordConfirm) {
      throw new BadRequestException('Confirm password');
    }

    const salt = await bcrypt.genSalt(roundsOfHashing);
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    const token = randomBytes(32).toString('hex');
    registerUserDto.password = hashedPassword;

    const userEmail = await this.authRepository.findByEmail(
      registerUserDto.email,
    );

    if (userEmail) {
      throw new BadRequestException('User already exists with this email', {
        cause: new Error(),
        description: 'Try another email',
      });
    }

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

    this.notificationsClient.emit('notifications.user.registered', data);

    return {
      id: userId,
      email: registerUserDto.email,
      name: registerUserDto.username,
      accessToken: emailVerificationToken.token,
    };
  }
}
