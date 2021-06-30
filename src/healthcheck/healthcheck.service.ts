import { HealthCheckRO, HealthCheckStatus } from './interfaces/healthcheck.interface';

import CacheService from '../cache/cache.service';
import { Injectable } from '@nestjs/common';

/**
 * This service provides methods to check health status of the microservice.
 */
@Injectable()
export default class HealthCheckService {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * Returns operational healthcheck status as precondition to perform any operation.
   */
  async getHealthCheck(): Promise<HealthCheckRO> {
    return {
      healthy: true,
    };
  }

  /**
   * Returns own healthcheck status as ability to interact with redis.
   */
  async getRedisHealth(): Promise<HealthCheckStatus> {
    try {
      const response = await this.cacheService.getHealth();

      return {
        healthy: response === 'ready',
      };
    } catch (err) {
      return {
        healthy: false,
        err,
      };
    }
  }
}
