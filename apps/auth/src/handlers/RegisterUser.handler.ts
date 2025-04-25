import { CommandHandler } from 'cqrs';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterUserCommand } from '../commands';
import { ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../repository/auth.respository';
import { BadRequestException } from '@nestjs/common';
import { roundsOfHashing, tempRegisterDate } from 'libs/data/defaultData';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: RegisterUserCommand) {
    const { registerUserDto } = command;

    if (registerUserDto.password !== registerUserDto.passwordConfirm) {
      throw new BadRequestException('Confirm password');
    }

    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      roundsOfHashing,
    );
    const token = randomBytes(32).toString('hex');
    registerUserDto.password = hashedPassword;
    let email = registerUserDto.email;

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
      name: registerUserDto.username,
      email: registerUserDto.email,
      password: hashedPassword,
    };

    const createdUser = await this.authRepository.create(userData);

    const userId = createdUser.id;

    const emailVerificationToken = await this.authRepository.createToken({
      userId,
      token,
      tempDate: tempRegisterDate,
    });
  }
}
