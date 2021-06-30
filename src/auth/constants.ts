import { InternalJwtPayload, InternalJwtVersionEnum } from '@hqo/users-service-common';

// Claims that we send to microservice when making system call.
export const SERVICE_TOKEN_PAYLOAD: InternalJwtPayload = {
  'user-authorization-ver': InternalJwtVersionEnum.v1_0,
  'sub': 0,
  'uuid': '',
  'user': {
    id: 0,
    uuid: '',
    company_uuid: '',
  },
  'system': true,
  'claims': {},
};
