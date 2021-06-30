import { Transform } from 'class-transformer';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export const transformStringToArrayNumberFunction = (params: TransformFnParams): any => {
  if (typeof params.value === 'string') {
    return parseInt(params.value, 10);
  }
  if (Array.isArray(params.value)) {
    return params.value.map((stringValue) => parseInt(stringValue, 10));
  }
  return params.value;
};

export const TransformStringToArrayNumber = (): PropertyDecorator => Transform(transformStringToArrayNumberFunction);
