import { Transform } from 'class-transformer';

const DEFAULT_DELIMITER = ',';
const ALL_VALUE = 'all';

interface ITransformStringToArrayOptions {
  delimiter: string;
  trim?: boolean;
}

export const transformStringToArrayFunction = (
  value: string,
  options: ITransformStringToArrayOptions,
): Array<string> | string => {
  const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;
  let result = value !== ALL_VALUE ? value.split(delimiter) : value;
  if (!!options?.trim && Array.isArray(result)) {
    result = result.map((el) => el.trim());
  }

  return result;
};

export const TransformStringToArray = (options?: ITransformStringToArrayOptions): PropertyDecorator =>
  Transform((params) => transformStringToArrayFunction(params.value, options));
