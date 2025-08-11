import { Module } from '@nestjs/common';
import * as Repository from 'libs/common/src/repository';
import { UsersController } from './users.controller';

import {
  CommonModule,
  isDevelopment,
  PrismaService,
  RmqModule,
} from '@app/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { GetProfileUserHandler } from './handlers/GetProfile.handler';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopment
        ? './apps/users/.env'
        : './apps/users/.env.prod',
    }),
    CqrsModule.forRoot({}),
    RmqModule.register({
      name: 'AUTH',
    }),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    GetProfileUserHandler,
    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,
    Repository.UserRepository,
  ],
})
export class UsersModule {}
