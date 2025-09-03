import { Module } from '@nestjs/common';
import * as Repository from 'libs/common/src/repository';
import { UsersController } from './users.controller';

import {
  CommonModule,
  isDevelopment,
  PrismaService,
  RmqService,
} from '@/app/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { GetProfileUserHandler } from './handlers/GetProfile.handler';
import { RedisModule } from '@/app/common/redis/redis.module';
import { RedisService } from '@/app/common/redis/redis.service';
import { FindAllUsersHandler } from './handlers/FindAllUsers.handler';
import { RedisRepository } from '@/app/common/redis/redis.repository';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopment
        ? './apps/users/.env.development'
        : './apps/users/.env.prod',
    }),
    CqrsModule.forRoot({}),
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    RmqService,
    RedisService,
    RedisRepository,
    GetProfileUserHandler,
    FindAllUsersHandler,
    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,
    Repository.UserRepository,
  ],
})
export class UsersModule {}
