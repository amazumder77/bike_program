import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import HealthCheckService from './healthcheck.service';
import HealthCheckStatusDto from './dto/healthcheck-status.dto';
import { WinstonLoggerService } from '@hqo/nestjs-winston-logger';

@ApiTags('system')
@Controller('healthcheck')
export default class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private winstonLoggerService: WinstonLoggerService,
  ) {}

  @Get()
  async getHealthCheck(): Promise<HealthCheckStatusDto> {
    const health = await this.healthCheckService.getHealthCheck();
    this.winstonLoggerService.debug('Healthcheck status', health);
    if (!health.healthy) {
      throw new ServiceUnavailableException(health);
    }

    return health;
  }
}
