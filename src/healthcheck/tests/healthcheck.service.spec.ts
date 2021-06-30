import CacheService from '../../cache/cache.service';
import HealthCheckService from '../healthcheck.service';
import { PartialMock } from '../../@types/helpers.s';
import { Test } from '@nestjs/testing';
import { createUniversalMock } from '@hqo/shared-modules/dist';

describe('HealthCheck Service', () => {
  let healthCheckService: HealthCheckService;
  const cacheService: PartialMock<CacheService> = createUniversalMock();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        { provide: CacheService, useValue: cacheService },
      ],
    }).compile();

    healthCheckService = module.get(HealthCheckService);
  });

  describe('getHealthCheck', () => {
    it('should return healthy: true if all components are healthy', async () => {
      cacheService.getHealth.mockReturnValueOnce('ready');

      expect(await healthCheckService.getHealthCheck()).toEqual({
        healthy: true,
      });
    });
  });
});
