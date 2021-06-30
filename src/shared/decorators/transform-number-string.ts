import { Transform } from 'class-transformer';
import * as _ from 'lodash';

export interface TransformNumberStringOptions {
  convertNulls?: boolean;
}

export const TransformNumberString = (options?: TransformNumberStringOptions): PropertyDecorator =>
  Transform((params) => {
    if (options && options.convertNulls) {
      params.value = params.value === 'null' ? null : params.value;
    }
    return params.value === null || (_.isEmpty(params.value) && typeof params.value === 'string')
      ? null
      : _.toNumber(params.value);
  });
