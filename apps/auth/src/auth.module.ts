import { Module, Global } from '@nestjs/common';
import Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Handlers from './handlers';
import { CommonModule, PrismaService, RmqModule } from '@app/common';
import * as Repository from './repository';
import { BILLING_SERVICE } from './constants/services';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      // envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
      envFilePath: './apps/auth/.env',
    }),
    CqrsModule.forRoot({}),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    ...Object.values(Handlers),
    ...Object.values(Repository),
  ],
})
export class AuthModule {}
