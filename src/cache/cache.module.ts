import { Global, Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { cacheServiceProvider, redisProvider } from './cache.provider';
import CacheService from './cache.service';

@Global()
@Module({
  controllers: [CacheController],
  providers: [CacheService, cacheServiceProvider, redisProvider],
  exports: [CacheService],
})
export default class CacheModule {}
