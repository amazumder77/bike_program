import CacheService from '../cache.service';

type Option<T> = T | ((...args: Array<unknown>) => T);

export interface CacheOptions {
  /**
   * The unique cache's key
   */
  key: Option<string>;
  /**
   * Time in seconds after which cached value will become obsolete
   */
  ttl: Option<number>;
}

const getOptionValue = <T>(option: Option<T>, args: Array<unknown>): T => {
  if (typeof option === 'function') {
    // eslint-disable-next-line no-shadow
    return (option as (...args: Array<unknown>) => T)(...args);
  }

  return option;
};

/**
 * Caches the method's returned value in CacheService and returns cached results
 *
 * Notes:
 * - if original method return `null` or `undefined` then cache won't be used
 * - the implementation doesn't use `exists` method to maintain atomicity
 */
export const Cache = (options: CacheOptions) => (
  target: unknown,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<
    (...args: Array<unknown>) => Promise<unknown>
  >,
): void => {
  if (typeof descriptor.value !== 'function') {
    throw new Error(`${Cache.name} decorator must be applied to a method`);
  }

  const originalMethod = descriptor.value;

  descriptor.value = async function findDescriptor(...args) {
    const cacheKey = getOptionValue(options.key, args);
    const cacheTtl = getOptionValue(options.ttl, args);

    const cachedValue = await CacheService.instance.get(cacheKey);
    if (cachedValue !== null && cachedValue !== undefined) {
      return cachedValue;
    }

    const freshValue = await originalMethod.apply(this, args);
    if (freshValue !== null && freshValue !== undefined) {
      await CacheService.instance.set(cacheKey, freshValue, cacheTtl);
    }

    return freshValue;
  };
};
