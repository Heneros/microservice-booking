import { Module, Global } from '@nestjs/common';
import Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Repository from 'libs/common/src/repository';
// import * as Handlers from './handlers/index';
import {
  CommonModule,
  PrismaService,
  RmqModule,
  RmqService,
} from '@app/common';

import { BILLING_SERVICE } from './constants/services';
import { JwtModule } from '@nestjs/jwt';
import { RegisterUserHandler } from './handlers/RegisterUser.handler';
import { LoginUserHandler } from './handlers/LoginUser.handler';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    // RegisterUserHandler,

    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,

    RegisterUserHandler,
    LoginUserHandler,
    // ...Object.values(Handlers),
    // ...Object.values(Repository),

    RmqService,
    // LocalSt
  ],
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      // envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
      envFilePath: './apps/auth/.env',
    }),
    CqrsModule.forRoot({}),
    RmqModule.register({
      name: 'BILLING',
    }),

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
