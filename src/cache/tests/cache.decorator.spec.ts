import { Cache, CacheOptions } from '../decorators/cache.decorator';

import CacheService from '../cache.service';
import { PartialMock } from '../../@types/helpers.s';
import { createUniversalMock } from '@hqo/shared-modules/dist';

const cacheService: PartialMock<CacheService> = createUniversalMock();
// @ts-ignore: access private property
CacheService._instance = cacheService;
const originalMethodSpy = jest.fn();

// The options object is set in `beforeEach` because it is modified in some tests
const cacheOptions: CacheOptions = {} as any;

class Dummy {
  @Cache(cacheOptions)
  async method(): Promise<unknown> {
    return await this.anotherMethod();
  }

  async anotherMethod(): Promise<unknown> {
    return await originalMethodSpy();
  }
}

describe('CacheDecorator', () => {
  let dummy: Dummy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    cacheOptions.key = 'cache-key';
    cacheOptions.ttl = 600;

    dummy = new Dummy();
  });

  describe('when cache exists', () => {
    beforeEach(() => {
      cacheService.get.mockResolvedValue('value-from-cache');
    });

    it('should return cached value', async () => {
      expect(await dummy.method()).toBe('value-from-cache');
    });

    it('should not call the original method', async () => {
      await dummy.method();

      expect(originalMethodSpy).not.toHaveBeenCalled();
    });
  });

  describe('when cache does not exist', () => {
    beforeEach(() => {
      cacheService.get.mockResolvedValue(null);
      originalMethodSpy.mockResolvedValue('fresh-value');
    });

    it('should call original method', async () => {
      await dummy.method();

      expect(originalMethodSpy).toHaveBeenCalled();
    });

    it('should cache results', async () => {
      await dummy.method();

      expect(cacheService.set).toHaveBeenCalledWith('cache-key', 'fresh-value', 600);
    });

    it('should not cache undefined results', async () => {
      originalMethodSpy.mockResolvedValue(undefined);

      await dummy.method();

      expect(cacheService.set).not.toHaveBeenCalled();
    });

    it('should return results', async () => {
      expect(await dummy.method()).toBe('fresh-value');
    });
  });

  describe('when options contain callback functions', () => {
    beforeEach(() => {
      cacheOptions.key = jest.fn().mockReturnValue('a-cache-key');
      cacheOptions.ttl = jest.fn().mockReturnValue(900);
      originalMethodSpy.mockResolvedValue('fresh-value');
    });

    it('should get options from those callback functions', async () => {
      await dummy.method();

      expect(cacheService.set).toHaveBeenCalledWith('a-cache-key', 'fresh-value', 900);
    });

    it('should pass original arguments down to those callback functions', async () => {
      // @ts-ignore: for testing
      await dummy.method(1, 'a', { when: 'now' });

      expect(cacheOptions.key).toHaveBeenCalledWith(1, 'a', { when: 'now' });
      expect(cacheOptions.ttl).toHaveBeenCalledWith(1, 'a', { when: 'now' });
    });
  });
});
