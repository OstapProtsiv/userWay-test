import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  private readonly expirationTime = 3600;
  public constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  async set(key: string, value: string) {
    await this.client.set(key, value, 'EX', this.expirationTime);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
