import { Module, Global } from '@nestjs/common';
import Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
    }),
    CqrsModule.forRoot({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
