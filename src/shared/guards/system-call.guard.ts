import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

/**
 * The guard for checking whether a system level call was made
 */
@Injectable()
export default class SystemCallGuard implements CanActivate {
  private getRequestFromContext(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequestFromContext(context);

    const { disableAuthGuards } = request;

    // Bypass all checks if it is a system level call.
    // Temporary solution to avoid implementing helix-wide system checks until further testing is done
    return !!disableAuthGuards;
  }
}
