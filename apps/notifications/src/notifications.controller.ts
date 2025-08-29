import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('notifications.user.registered')
  async handleUserVerifyEmail(@Payload() data: any) {
    try {
      const { user, title, template, token } = data;
      await this.notificationsService.sendEmailVerify(
        user,
        title,
        template,
        token,
      );
      /////console.log('Email was sent!');
    } catch (error) {
      console.error('Err', error);
    }
  }
}
