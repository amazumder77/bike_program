import { ApiResponseProperty } from '@nestjs/swagger';
import { HealthCheckStatus } from '../interfaces/healthcheck.interface';

export default class HealthCheckStatusDto implements HealthCheckStatus {
  @ApiResponseProperty()
  healthy!: boolean;

  @ApiResponseProperty()
  err?: Record<string, unknown>;
}
