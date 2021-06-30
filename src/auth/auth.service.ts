import { InternalJwtPayload } from '@hqo/users-service-common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HQO_AUTHORIZATION_HEADER } from '../shared/api/constants';
import { SERVICE_TOKEN_PAYLOAD } from './constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Gets payload from the internal JWT token
   */
  getInternalTokenData(token: string): InternalJwtPayload | null {
    const payload = this.jwtService.decode(token) as InternalJwtPayload;
    return payload ?? null;
  }

  async provideInternalTokenRequestData(req: Request): Promise<void> {
    const internalToken = req.header?.(HQO_AUTHORIZATION_HEADER);

    if (internalToken) {
      const internalTokenPayload = await this.getInternalTokenData(internalToken);
      req.claims = internalTokenPayload?.claims;
      req.disableAuthGuards = !!internalTokenPayload?.system;

      // In case user was authorized, add additional fields from internal token, but don't override external token values
      if (!req.user && internalTokenPayload?.user) {
        req.user = { ...internalTokenPayload?.user, ...req.user };
      }
    }
  }

  public getServiceUserToken(): string {
    // Token would live only one minute because it is regenerated for each request.
    const token = this.jwtService.sign(SERVICE_TOKEN_PAYLOAD, {
      expiresIn: '1m',
    });
    return token;
  }
}
