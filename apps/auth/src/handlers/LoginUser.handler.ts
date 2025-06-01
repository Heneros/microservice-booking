import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserCommand } from '../commands/LoginUser.command';
import { AuthRepository } from '@app/common';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { logInDto } = command;
    try {
      const user = await this.authRepository.findByEmail({
        email: logInDto.email,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (user.blocked) {
        throw new BadRequestException('User is blocked');
      }
      const isPasswordValid = await bcrypt.compare(
        logInDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      const payload = {
        id: user.id,
        username: user.username,
        roles: user.roles,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '31d',
      });
      // await this.authRepository.deleteToken({
      //   where: { userId: user.id },
      // });
      // await this.authRepository.updateToken(user.id, refreshToken);
      // await this.authRepository.updateProfile(user.id, {
      //   refreshToken: [refreshToken],
      // });
      // return {
      //   accessToken,
      //   refreshToken,
      //   // user,
      //   user: {
      //     id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     roles: user.roles,
      //   },
      // };
    } catch (error) {
      // console.error('Error setting cookie or sending response:', error);
      throw error;
    }
    // return isPasswordValid;
  }
}
