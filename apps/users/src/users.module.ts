import { Module } from '@nestjs/common';
import * as Repository from 'libs/common/src/repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommonModule, PrismaService, RmqModule } from '@app/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { GetProfileQuery } from './query/GetProfile.query';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/users/.env',
    }),
    CqrsModule.forRoot({}),
    RmqModule.register({
      name: 'AUTH',
    }),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    GetProfileQuery,
    Repository.AuthRepository,
    Repository.VerifyResetTokenRepository,
    Repository.UserRepository,
    UsersService,
  ],
})
export class UsersModule {}
