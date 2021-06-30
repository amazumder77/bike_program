// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthPayload } from '../../auth/interfaces/auth-payload.interface';

export interface User {
  uuid?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      authPayload: AuthPayload;
      externalToken: string;
      claims: import('@hqo/users-service-common').Claims | null;
      disableAuthGuards?: boolean;
    }
  }
}
