import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RedisService } from '@/app/common/redis/redis.service';
import { NOTIFY_SERVICE, RedisPrefixEnum, RmqService } from '@/app/common';

@Controller()
export class NotificationsController {
  constructor(
    private readonly rmqService: RmqService,
    @Inject(RedisService) private readonly redisService: RedisService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @MessagePattern(NOTIFY_SERVICE.NOTIFY_USER_REGISTER)
  async handleUserVerifyEmail(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { title, template, token } = data;
      // console.log('data', data);
      // console.log('datats', title, template, token )
      const emailId = `${RedisPrefixEnum.NOTIFICATION_SEND_EMAIL}:${data.user.email}:${data.user.id}`;
      // const msg = context.getMessage();
      const alreadySent = await this.redisService.getEmailNotify(emailId);

      if (alreadySent) {
        console.log('Sent Already', alreadySent);
        return;
      }
      // console.log('Test', alreadySent)
      try {
        await this.notificationsService.sendEmailVerify(
          data.user,
          title,
          template,
          token.token,
        );
        this.rmqService.ack(context);
        await this.redisService.saveNotifyEmail(
          String(data.user.id),
          data.user,
        );
        return data.user;
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }

        throw error;
      }

      /////console.log('Email was sent!');
    } catch (error) {
      console.error('Err', error);
    }
  }
}
