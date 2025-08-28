import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
  import { MailerModule } from '@nestjs-modules/mailer';
import { isDevelopment, isTest } from '@/app/common';
import path from 'path'

@Module({
  imports: [
  MailerModule.forRoot({
     transport: {
      host: isDevelopment?   '127.0.0.1' : process.env.SMTP_HOST,
      secure:   isDevelopment ? false :  true,
       port: isDevelopment ? 1025 : 587,
       auth: isDevelopment ? null :  {
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
                          dir: isDevelopment
                              ? path.join(
                                    process.cwd(),
                                    '/dist/apps/notifications/templates',
                                )
                                : path.join(__dirname, '/templates'),
                          adapter:
                              new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter').HandlebarsAdapter)(),
                          options: {
                              strict: true,
                          },
                      },
                  }),
  })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
