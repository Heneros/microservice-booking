import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PrismaService, RabbitMqModule } from '@/libs/common/src';
import { RedisModule } from '@/libs/common/src/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisRepository } from '@/libs/common/src/redis/redis.repository';
import * as Repository from 'libs/common/src/repository';

import * as Handlers from './handlers/index';

@Module({
  imports: [RabbitMqModule, RedisModule, CqrsModule.forRoot({})],
  controllers: [HotelsController],
  providers: [
    HotelsService,
    PrismaService,
    RedisRepository,
    ...Object.values(Handlers),
  ],
})
export class HotelsModule {}
