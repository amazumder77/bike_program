import * as RedisClient from 'ioredis';

import CacheService from './cache.service';
import ConfigService from '../config/config.service';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { REDIS_CLIENT_TOKEN } from './constants';

export const redisProvider: FactoryProvider = {
  provide: REDIS_CLIENT_TOKEN,
  useFactory: async (config: ConfigService) =>
    new RedisClient({
      port: config.getNumber('REDIS_PORT'),
      host: config.get('REDIS_HOST'),
    }),
  inject: [ConfigService],
};

export const cacheServiceProvider: FactoryProvider = {
  provide: CacheService,
  useFactory: async (client: RedisClient.Redis) => new CacheService(client),
  inject: [REDIS_CLIENT_TOKEN],
};
