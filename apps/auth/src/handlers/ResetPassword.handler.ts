import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { BadRequestException, Inject } from '@nestjs/common';
import { ResetPasswordCommand } from '../commands/ResetPassword.command';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthRepository,
  NOTIFY_SERVICE,
  roundsOfHashing,
  VerifyResetTokenRepository,
} from '@/app/common';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly verifyResetTokenRepository: VerifyResetTokenRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: ResetPasswordCommand) {
    const { userId, resetPasswordDto } = command;
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
      throw new BadRequestException('Password do not match');
    }

    const verificationToken = await this.verifyResetTokenRepository.findUnique({
      userId,
    });

    // console.log(verificationToken);
    if (!verificationToken || new Date() > verificationToken.expiresAt) {
      throw new BadRequestException(
        'Your token is either invalid or expired. Try resetting your password again',
      );
      return;
    }
    const user = await this.authRepository.findById(userId);
    if (user && verificationToken) {
      const newPass = await bcrypt.hash(
        resetPasswordDto.password,
        roundsOfHashing,
      );

      await this.authRepository.updatePassword(user.id, newPass);

      const data = {
        subject: 'Your password was reset successfully!',
        template: './resetPasswordSuccess',
        user,
        link: '/auth/login',
      };

      this.notificationsClient.emit(
        NOTIFY_SERVICE.NOTIFY_USER_SUCCESS_PASS,
        data,
      );
      // await this.mailService.resendEmail(
      //     updateUser,
      //     'Your password was reset successfully!',
      //     './resetPassword',
      //     payload,
      // );

      return {
        message: 'Your password was reset successfully!',
      };
    }
  }
}
