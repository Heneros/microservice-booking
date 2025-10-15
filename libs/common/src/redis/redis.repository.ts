import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisPrefixEnum } from '../data/redis-prefix-enum';

@Injectable()
export class RedisRepository {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private generateKey(prefix: RedisPrefixEnum, key: string): string {
    return `${prefix}:${key}`;
  }

  async get<T>(prefix: RedisPrefixEnum, key: string): Promise<T | null> {
    const fullKey = this.generateKey(prefix, key);

    try {
      const raw = await this.redis.get(fullKey);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch (error) {
        return raw as unknown as T;
      }
    } catch (err) {
      console.error(`Redis GET failed for ${fullKey}: ${err.message}`);
      return null;
    }
  }

  async set<T>(
    prefix: RedisPrefixEnum,
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    const fullKey = this.generateKey(prefix, key);

    const serialized =
      typeof value === 'string' ? (value as any) : JSON.stringify(value);
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await this.redis.set(fullKey, serialized, 'EX', ttlSeconds);
      } else {
        await this.redis.set(fullKey, serialized);
      }
    } catch (err) {
      console.error(`Redis SET failed for ${fullKey}: ${err.message}`);
    }
  }

  async delete(prefix: RedisPrefixEnum, key: string): Promise<void> {
    await this.redis.del(`${prefix}:${key}`);
  }

  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (err) {
      console.error('Redis FLUSHALL failed', err);
    }
  }

  async deleteByPattern(pattern: string) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
