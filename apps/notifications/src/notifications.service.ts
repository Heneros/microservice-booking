import { domain } from '@/app/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  email: string;
  username: string;
}

interface ResendEmail {
  name: string;
  link: string;
}

@Injectable()
export class NotificationsService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerify(
    user: User,
    subject: string,
    template: string,
    emailVerificationToken: string,
  ) {
    const link = `${domain}/auth/verify/${emailVerificationToken}/${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: {
        name: user.username,
        link,
      },
    });
  }

  async welcomeEmail(subject: string, template: string, user: User) {
    const link = `${domain}/auth/login`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: {
        username: user.username,
        link,
      },
    });
  }

  async resendEmail(
    user: User,
    subject: string,
    template: string,
    payload: ResendEmail,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: payload,
    });
  }
}
