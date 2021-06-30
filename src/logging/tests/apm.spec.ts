import * as ddTrace from 'dd-trace';

import { APM_PORT, setupTracer } from '../setup-tracer';

const initProps = {
  port: APM_PORT,
  logInjection: true,
  runtimeMetrics: true,
};

describe('setupTracer func', () => {
  it('should setup dd-trace', () => {
    const ddTraceSpy = jest.spyOn(ddTrace.tracer, 'init');
    setupTracer();
    expect(ddTraceSpy).toHaveBeenCalledTimes(1);
    expect(ddTraceSpy).toHaveBeenCalledWith(initProps);
  });
  it('should use express config and blacklist healthcheck endpoint', () => {
    const ddTraceSpyUse = jest.spyOn(ddTrace.tracer, 'use');
    setupTracer();
    expect(ddTraceSpyUse).toHaveBeenCalled();
    expect(ddTraceSpyUse).toHaveBeenCalledWith('express', {
      blacklist: ['/healthcheck'],
    });
  });
});
