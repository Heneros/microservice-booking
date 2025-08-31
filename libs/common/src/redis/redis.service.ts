import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisPrefixEnum } from '../data/redis-prefix-enum';
import { CACHE_TTL } from '../data/ttl';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private makeKey(prefix: RedisPrefixEnum, key: string | number): string {
    return `${prefix}:${key}`;
  }

  async saveUser<T>(id: number, data: T): Promise<void> {
    const key = this.makeKey(RedisPrefixEnum.USERS_ID, id);
    const value = JSON.stringify(data);
    await this.redis.set(key, value);
    await this.redis.expire(key, CACHE_TTL.ONE_MINUTE);
  }

  async deleteUser(id: number): Promise<void> {
    const key = this.makeKey(RedisPrefixEnum.USERS_ID, id);
    await this.redis.del(key);
  }

  async getProfile(id: number): Promise<string | null> {
    const key = this.makeKey(RedisPrefixEnum.USERS_ID, id);
    const result = await this.redis.get(key);
    if (result) {
      return JSON.parse(result);
    }

    return null;
  }

  async getEmailNotify(id: string): Promise<string | null> {
    const key = this.makeKey(RedisPrefixEnum.NOTIFICATION_SEND_EMAIL, id);
    const result = await this.redis.get(key);
    if (result) {
      return JSON.parse(result);
    }

    return null;
  }

  async saveNotifyEmail<T>(id: string, data: T): Promise<void> {
    const key = this.makeKey(RedisPrefixEnum.NOTIFICATION_SEND_EMAIL, id);
    const value = JSON.stringify(data);
    await this.redis.set(key, value);
    await this.redis.expire(key, CACHE_TTL.THREE_HOUR);
  }
}
