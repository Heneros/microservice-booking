import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VerifyUserQuery } from '../queries/VerifyUser.query';

import {
  AuthRepository,
  NOTIFY_SERVICE,
  VerifyResetTokenRepository,
} from '@/app/common';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@QueryHandler(VerifyUserQuery)
export class VerifyUserlHandler implements IQueryHandler<VerifyUserQuery> {
  constructor(
    @Inject('NOTIFICATIONS') private notificationsClient: ClientProxy,
    private readonly verifyResetTokenRepository: VerifyResetTokenRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(query: VerifyUserQuery) {
    const { token, userId } = query;

    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found ');
    }

    if (user?.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const emailVerificationToken =
      await this.verifyResetTokenRepository.findTokenByTokenValue(token);

    if (!emailVerificationToken) {
      throw new BadRequestException('Not found token');
    }

    if (new Date() > emailVerificationToken.expiresAt) {
      throw new BadRequestException('Expired token or invalid token');
    }

    // console.log(emailVerificationToken);

    await this.authRepository.verifyUser(emailVerificationToken.userId);

    await this.verifyResetTokenRepository.updateToken(
      emailVerificationToken.userId,
      emailVerificationToken.token,
    );

    const data = {
    
      subject: 'Your email is verified!',
      template: './welcome',
        user: user,
      //   token: emailVerificationToken.token,
    };

    this.notificationsClient.emit(NOTIFY_SERVICE.NOTIFY_USER_WELCOME, data);

    // await this.mailService.sendEmail(
    //     false,
    //     user,
    //     'Your email is verified!',
    //     './welcome',
    //     emailVerificationToken,
    // );
    return {
      id: user.id,
      message: 'Your email is verified!',
    };
  }
}
