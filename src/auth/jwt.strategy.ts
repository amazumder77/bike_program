import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import ConfigService from '../config/config.service';
import { JwtContent } from './interfaces/jwt-content.interface';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(`hqo-authorization`),
      ignoreExpiration: false,
      secretOrKey: configService.get(`INTERNAL_JWT_SECRET`) ?? `test`,
    });
  }

  /**
   * This should be filled out with any business logic required from the jwt payload
   */
  async validate({ sub: userId }: JwtContent): Promise<any> {
    try {
      return userId ?? 'test'; // TODO: implement this
    } catch (error) {
      if (error) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException();
    }
  }
}
