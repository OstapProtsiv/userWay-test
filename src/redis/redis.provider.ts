import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory:
    process.env.NODE_ENV !== 'test'
      ? (): RedisClient => {
          return new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            db: parseInt(process.env.REDIS_DB || '0'),
          });
        }
      : (): RedisClient => {
          return new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            db: parseInt(process.env.REDIS_TEST_DB || '0'),
          });
        },
  provide: 'REDIS_CLIENT',
};
