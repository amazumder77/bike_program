import { ExecutionContext } from '@nestjs/common';
import SystemCallGuard from '../system-call.guard';

describe('SystemCallGuard', () => {
  let guard: SystemCallGuard;
  let request: Request;
  const executionContextMock = (_request: Request) =>
    (({
      switchToHttp: () => ({
        getRequest: () => _request,
      })
    } as unknown) as ExecutionContext);

  beforeEach(() => {
    guard = new SystemCallGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', (): void => {
    it('should return false', () => {
      request = ({ disableAuthGuards: false } as unknown) as Request;
      const context = executionContextMock(request);

      expect(guard.canActivate(context)).toBeFalsy();
    });
    it('should return true', () => {
      request = ({ disableAuthGuards: true } as unknown) as Request;
      const context = executionContextMock(request);

      expect(guard.canActivate(context)).toBeTruthy();
    });
  });
});
