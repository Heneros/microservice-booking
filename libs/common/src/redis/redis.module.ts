import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisRepository } from './redis.repository';
import { RedisProvider } from './redis.provider';

@Module({
  providers: [RedisService, RedisRepository, RedisProvider],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
