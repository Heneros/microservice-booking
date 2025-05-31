import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { RegisterUserCommand } from '../commands';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BadRequestException } from '@nestjs/common';
import { roundsOfHashing, tempRegisterDate } from 'libs/data/defaultData';
import { AuthRepository, VerifyResetTokenRepository } from '../repository';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
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
    // let email = registerUserDto.email;
    // console.log(registerUserDto.email);

    const userEmail = await this.authRepository.findByEmail({
      email: registerUserDto.email,
    });

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

    return {
      id: userId,
      email: registerUserDto.email,
      name: registerUserDto.username,
      accessToken: emailVerificationToken.token,
    };
  }
}
