import { CacheController } from '../cache.controller';
import CacheService from '../cache.service';
import { PartialMock } from '../../@types/helpers.s';
import { Test } from '@nestjs/testing';
import { createUniversalMock } from '@hqo/shared-modules/dist';

describe('CacheController', () => {
  let controller: CacheController;
  const cacheService: PartialMock<CacheService> = createUniversalMock();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CacheController],
      providers: [{ provide: CacheService, useValue: cacheService }],
    }).compile();

    controller = module.get(CacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('destroy', () => {
    it('should delete a key from redis', async () => {
      const redisKey = 'key_1';

      cacheService.delete.mockResolvedValueOnce(redisKey);

      expect(await controller.destroy(redisKey)).toEqual({ success: true });
      expect(cacheService.delete).toHaveBeenNthCalledWith(1, encodeURIComponent(redisKey));
    });
  });
});
