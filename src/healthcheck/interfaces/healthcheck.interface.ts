export interface HealthCheckRO {
  healthy: boolean;
}

export interface HealthCheckStatus {
  healthy: boolean;
  err?: Record<string, unknown>;
}
