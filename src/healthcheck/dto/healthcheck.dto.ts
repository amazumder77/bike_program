import { ApiResponseProperty } from '@nestjs/swagger';
import { HealthCheckRO } from '../interfaces/healthcheck.interface';
import HealthCheckStatusDto from './healthcheck-status.dto';

export default class HealthCheckRoDto extends HealthCheckStatusDto implements HealthCheckRO {
  @ApiResponseProperty()
  redis!: HealthCheckStatusDto;
}
