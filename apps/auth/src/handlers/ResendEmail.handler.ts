import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import {
  BadRequestException,
  HttpException,
  Inject,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';

import { ResendEmailCommand } from '../commands/ResendEmail.command';
import {
  AuthRepository,
  NOTIFY_SERVICE,
  tempRegisterDate,
  VerifyResetTokenRepository,
} from '@/app/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(ResendEmailCommand)
export class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly authRepository: AuthRepository,
    private readonly verifyResetToken: VerifyResetTokenRepository,
  ) {}

  async execute(command: ResendEmailCommand) {
    try {
      const { email } = command;

      // console.log(userId, email);
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // console.log(user);
      if (user.isEmailVerified) {
        throw new BadRequestException('User already verified');
      }

      const token = randomBytes(32).toString('hex');
const userId = user.id
      const userToken = await this.verifyResetToken.findUnique({userId})
      if(userToken){
         await this.verifyResetToken.deleteToken(userId)
      }

      const emailVerificationToken = await this.verifyResetToken.createToken({
        userId: user.id,
        token,
        tempDate: tempRegisterDate,
      });
      const data = {
        user,
        title: 'Welcome to Booking App! Confirm your Email ',
        template: './confirmation',
        token: emailVerificationToken,
      };

      this.notificationsClient.emit(NOTIFY_SERVICE.NOTIFY_USER_REGISTER, data);

               return {
                message: 'Email was successfully sent',
                status: 200,
            };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);

      throw new BadRequestException('Error sending email', error);
    }
  }
}
