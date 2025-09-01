import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { isDevelopment, isTest, RabbitMqModule } from '@/app/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RedisModule } from '@/app/common/redis/redis.module';

const templateDir = isDevelopment
  ? join(process.cwd(), 'apps', 'notifications', 'src', 'templates')
  : join(process.cwd(), 'dist', 'apps', 'notifications', 'templates');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopment
        ? './apps/notifications/.env.development'
        : './apps/notifications/.env.prod',
    }),
    MailerModule.forRoot({
      transport: {
        host: isDevelopment ? 'maildev' : process.env.SMTP_HOST,
        secure: isDevelopment ? false : true,
        port: isDevelopment ? 1025 : 587,
        auth: isDevelopment
          ? null
          : {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
      },
      defaults: {
        from: `"No Replay" <noreply@example.com>`,
      },
      ...(isTest
        ? {}
        : {
            template: {
              dir: templateDir,
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
    }),
    RedisModule,
    RabbitMqModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
