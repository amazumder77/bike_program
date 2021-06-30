import HealthCheckController from './healthcheck.controller';
import { Module } from '@nestjs/common';
import HealthCheckService from './healthcheck.service';
import CacheModule from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export default class HealthCheckModule {}
