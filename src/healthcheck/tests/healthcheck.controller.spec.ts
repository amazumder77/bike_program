import HealthCheckController from '../healthcheck.controller';
import HealthCheckService from '../healthcheck.service';
import { PartialMock } from '../../@types/helpers.s';
import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';
import { createUniversalMock } from '@hqo/shared-modules/dist';

describe('HealthCheck Controller', () => {
  let healthCheckController: HealthCheckController;

  const healthCheckService: PartialMock<HealthCheckService> = createUniversalMock();
  const loggerService: PartialMock<WinstonLoggerService> = createUniversalMock();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: WinstonLoggerService, useValue: loggerService },
      ],
    }).compile();

    healthCheckController = module.get(HealthCheckController);
  });

  describe('healthcheck', () => {
    it('should return health check status', async () => {
      healthCheckService.getHealthCheck.mockResolvedValue({ healthy: true });

      expect(await healthCheckController.getHealthCheck()).toEqual({
        healthy: true,
      });
    });

    it('should throw error in not healthy', async () => {
      healthCheckService.getHealthCheck.mockResolvedValue({ healthy: false });

      await expect(healthCheckController.getHealthCheck())
        .rejects.toThrow(ServiceUnavailableException)
        .catch((error) => {
          expect((error as ServiceUnavailableException).getResponse()).toEqual({
            healthy: false,
          });
        });
    });
  });
});
