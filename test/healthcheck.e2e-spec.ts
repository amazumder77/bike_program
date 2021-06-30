import * as request from 'supertest';

import { closeApp, createUniversalMock } from '@hqo/shared-modules/dist';

import { AppModule } from '../src/app.module';
import CacheService from '../src/cache/cache.service';
import { INestApplication } from '@nestjs/common';
import { PartialMock } from '../src/@types/helpers.s';
import { REDIS_CLIENT_TOKEN } from '../src/cache/constants';
import { Test } from '@nestjs/testing';

describe('HealthCheck Controller (e2e)', () => {
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

  it('/healthcheck (GET): all are healthy', async () => {
    cacheService.getHealth.mockReturnValueOnce('ready');

    await request(app.getHttpServer()).get('/healthcheck').expect(200).expect({
      healthy: true,
    });
  });
});
