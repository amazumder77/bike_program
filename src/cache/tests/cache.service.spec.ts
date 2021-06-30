import CacheService from '../cache.service';
import { PartialMock } from '../../@types/helpers.s';
import { REDIS_CLIENT_TOKEN } from '../constants';
import { Redis } from 'ioredis';
import { Test } from '@nestjs/testing';
import { createUniversalMock } from '@hqo/shared-modules/dist';

jest.mock('ioredis');

describe('CacheService', () => {
  let service: CacheService;
  const key = 'test1';
  const value = 'testing';
  const redis: PartialMock<Redis> = createUniversalMock();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: REDIS_CLIENT_TOKEN, useValue: redis },
      ],
    }).compile();

    service = module.get(CacheService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('returns default value if key does not exist', async () => {
      expect(await service.get(key, 'default')).toEqual('default');
      expect(redis.exists).toHaveBeenNthCalledWith(1, key);
      expect(redis.get).not.toHaveBeenCalled();
    });

    it('returns value if key exists', async () => {
      redis.get.mockReturnValueOnce(JSON.stringify(value));

      expect(await service.get(key)).toEqual(value);
      expect(redis.get).toHaveBeenNthCalledWith(1, key);
    });
  });

  describe('exists', () => {
    it('returns false if key does not exist', async () => {
      expect(await service.exists(key)).toBeFalsy();

      expect(redis.exists).toHaveBeenNthCalledWith(1, key);
    });

    it('returns false if one only one key exist', async () => {
      const key2 = 'test2';
      redis.exists.mockReturnValueOnce(1);

      expect(await service.exists(key, key2)).toBeFalsy();
      expect(redis.exists).toHaveBeenNthCalledWith(1, key, key2);
    });

    it('returns true if key exist', async () => {
      redis.exists.mockReturnValueOnce(1);

      expect(await service.exists(key)).toBeTruthy();
      expect(redis.exists).toHaveBeenNthCalledWith(1, key);
    });

    it('returns true if all keys exist', async () => {
      const key2 = 'test2';
      redis.exists.mockReturnValueOnce(2);

      expect(await service.exists(key, key2)).toBeTruthy();
      expect(redis.exists).toHaveBeenNthCalledWith(1, key, key2);
    });
  });

  describe('delete', () => {
    it('deletes a key from the cache', async () => {
      redis.del.mockReturnValueOnce(1);

      expect(await service.delete(key)).toEqual(1);
      expect(redis.del).toHaveBeenNthCalledWith(1, key);
    });

    it('deletes multiple keys from the cache', async () => {
      const key2 = 'test2';
      redis.del.mockReturnValueOnce(2);

      expect(await service.delete(key, key2)).toEqual(2);
      expect(redis.del).toHaveBeenNthCalledWith(1, key, key2);
    });
  });

  describe('set', () => {
    it('sets an item in the cache with expiration', async () => {
      redis.set.mockReturnValueOnce(value);

      expect(await service.set(key, value, 10)).toEqual(value);
      expect(redis.set).toHaveBeenNthCalledWith(
        1,
        key,
        JSON.stringify(value),
        'EX',
        10,
      );
    });

    it('sets an item in the cache without expiration', async () => {
      redis.set.mockReturnValueOnce(value);

      expect(await service.set(key, value, false)).toEqual(value);
      expect(redis.set).toHaveBeenNthCalledWith(1, key, JSON.stringify(value));
    });
  });
});
