import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisRepository } from './redis.repository';
import { RedisProvider } from './redis.provider';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisRepository, RedisProvider],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
