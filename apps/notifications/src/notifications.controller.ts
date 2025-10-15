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
      const emailId = `${RedisPrefixEnum.NOTIFICATION_SEND_EMAIL}:${data.user.email}:${data.user.id}`;
      // const msg = context.getMessage();
      const alreadySent = await this.redisService.getEmailNotify(emailId);

      if (alreadySent) {
        //   console.log('Sent Already', alreadySent);
        return;
      }
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
    } catch (error) {
      console.error('Err', error);
    }
  }
  @MessagePattern(NOTIFY_SERVICE.NOTIFY_USER_WELCOME)
  async welcomeEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { subject, template, user } = data;
      await this.notificationsService.welcomeEmail(subject, template, user);

      channel.ack(originalMsg);
      return user;
    } catch (error) {
      console.error('Error in welcomeEmail:', error);
      channel.nack(originalMsg, false, false);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @MessagePattern(NOTIFY_SERVICE.NOTIFY_USER_REQUEST_PASS)
  async requestPassword(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { subject, template, user, link } = data;

      // console.log('data', data);
      await this.notificationsService.requestPassword(
        subject,
        template,
        user,
        link,
      );

      channel.ack(originalMsg);
      return user;
    } catch (error) {
      console.error('Error in requestPassword:', error);
      channel.nack(originalMsg, false, false);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @MessagePattern(NOTIFY_SERVICE.NOTIFY_USER_SUCCESS_PASS)
  async resetPassword(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { subject, template, user, link } = data;

      // console.log('data', data);
      await this.notificationsService.requestPassword(
        subject,
        template,
        user,
        link,
      );

      channel.ack(originalMsg);
      return user;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      channel.nack(originalMsg, false, false);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }
}
