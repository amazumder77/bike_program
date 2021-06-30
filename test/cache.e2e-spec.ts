import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import CacheService from '../src/cache/cache.service';
import { INestApplication } from '@nestjs/common';
import { PartialMock } from '../src/@types/helpers.s';
import { Test } from '@nestjs/testing';
import { createUniversalMock, closeApp } from '@hqo/shared-modules/dist';
import { REDIS_CLIENT_TOKEN } from '../src/cache/constants';

describe('Cache Controller (e2e)', () => {
  let app: INestApplication;
  const cacheService: PartialMock<CacheService> = createUniversalMock();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CacheService)
      .useValue(cacheService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await closeApp(app, REDIS_CLIENT_TOKEN);
  });

  it('/cache (DELETE): delete success', async () => {
    cacheService.delete.mockReturnValueOnce(true);

    await request(app.getHttpServer()).delete('/cache/test').expect(200).expect({ success: true });
  });

  it('/healthcheck (GET): delete failed', async () => {
    cacheService.getHealth.mockReturnValueOnce(false);

    await request(app.getHttpServer())
      .delete('/cache/test')
      .expect(404)
      .expect({ statusCode: 404, message: 'No matching key found from redis' });
  });
});
