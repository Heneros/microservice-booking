import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisPrefixEnum } from '../data/redis-prefix-enum';

@Injectable()
export class RedisRepository {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private generateKey(prefix: RedisPrefixEnum, key: string): string {
    return `${prefix}:${key}`;
  }

  async get(prefix: RedisPrefixEnum, key: string): Promise<string | null> {
    const fullKey = this.generateKey(prefix, key);
    return await this.redis.get(fullKey);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redis.del(`${prefix}:${key}`);
  }

  async flushAll(): Promise<void> {
    await this.redis.flushall();
  }
}
