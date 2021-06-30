import * as ddTrace from 'dd-trace';

export const APM_PORT = 8126;

export function setupTracer(): void {
  const tracer = ddTrace.tracer.init({
    port: APM_PORT,
    logInjection: true,
    runtimeMetrics: true,
  });
  tracer.use('express', {
    blacklist: ['/healthcheck'],
  });
}
