import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';

import { BadRequestException, HttpException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ResetPasswordRequestCommand } from '../commands/RequestResetPassword.command';
import {
  AuthRepository,
  domain,
  NOTIFY_SERVICE,
  tempRegisterDate,
  VerifyResetTokenRepository,
} from '@/app/common';

@CommandHandler(ResetPasswordRequestCommand)
export class ResetPasswordRequestHandler
  implements ICommandHandler<ResetPasswordRequestCommand>
{
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly authRepository: AuthRepository,
    private readonly verifyResetToken: VerifyResetTokenRepository,
  ) {}

  async execute(command: ResetPasswordRequestCommand) {
    try {
      const { email } = command;

      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        throw new BadRequestException('No user exist');
      }

      const verificationToken = await this.verifyResetToken.findUnique({
        userId: user.id,
      });

      // console.log(user, verificationToken);

      if (verificationToken) {
        await this.verifyResetToken.deleteToken(user.id);
      }
      const resentToken = randomBytes(32).toString('hex');

      const emailToken = await this.verifyResetToken.createToken({
        userId: user.id,
        token: resentToken,
        tempDate: tempRegisterDate,
      });

      const emailLink = `${domain}/auth/reset_password?emailToken=${emailToken.token}&userId=${user.id}`;

      const data = {
        subject: 'Password Reset Request',
        template: './requestResetPassword.hbs',
        user,
        link: emailLink,
      };

      this.notificationsClient.emit(
        NOTIFY_SERVICE.NOTIFY_USER_REQUEST_PASS,
        data,
      );

      return {
        message: 'Email was successfully sent',
        status: 200,
      };
      // await this.mailService.resendEmail(
      //     user,
      //     'Password Reset Request',
      //     './requestResetPassword',
      //     payload,
      // );

      // res.status(200).json({
      //     message: 'Password Reset Request',
      // });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);

      throw new BadRequestException('Error sending email', error);
    }
  }
}
