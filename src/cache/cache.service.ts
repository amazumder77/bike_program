import { Inject, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT_TOKEN } from './constants';

export default class CacheService implements OnModuleDestroy {
  private static _instance: CacheService;

  constructor(
    @Inject(REDIS_CLIENT_TOKEN)
    private readonly client: Redis,
  ) {
    CacheService._instance = this;
  }

  public static get instance(): any {
    return this._instance;
  }

  public onModuleDestroy(): any {
    return this.client.disconnect();
  }

  /**
   * Get a value from the cache or the default value passed
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async get<T>(key: string, defaultValue?: any): Promise<T | null> {
    if (defaultValue !== undefined && !(await this.exists(key))) {
      return defaultValue;
    }
    const value = await this.client.get(key);
    return JSON.parse(value) as unknown as T;
  }

  /**
   * Sets a value in the cache.
   *
   * If ttl is false the cache does not expire
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async set(key: string, value: any, ttl: number | false): Promise<string> {
    const valueStr: string = JSON.stringify(value);
    // Set without expiration if no ttl is passed
    if (ttl === false) {
      return await this.client.set(key, valueStr);
    }
    return await this.client.set(key, valueStr, 'EX', ttl);
  }

  /**
   * Deletes one or more keys from the cache
   *
   * @returns Number of keys deleted
   */
  async delete(...keys: Array<string>): Promise<number> {
    return await this.client.del(...keys);
  }

  /**
   * Checks if cache key exists
   */
  async exists(...keys: Array<string>): Promise<boolean> {
    const result = await this.client.exists(...keys);
    return keys.length === result;
  }

  getHealth(): any {
    return this.client.status;
  }
}
