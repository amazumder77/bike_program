import * as _ from 'lodash';

import { Transform } from 'class-transformer';

export const TransformEmptyString = (): PropertyDecorator =>
  Transform((params) => (_.isEmpty(params.value) && typeof params.value === 'string' ? null : params.value));
