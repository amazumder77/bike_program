import { Transform } from 'class-transformer';

export const TransformBoolean = (): PropertyDecorator =>
  Transform((params) => {
    if (typeof params.value === 'string') {
      return params.value.toLowerCase() === 'true' || params.value.toLowerCase() === '1';
    } else if (typeof params.value === 'number') {
      return Boolean(params.value);
    } else if (params.value === undefined || params.value === null) {
      return false;
    }
    return params.value;
  });
