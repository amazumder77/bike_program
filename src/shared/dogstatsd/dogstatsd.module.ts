import { Module, Provider } from '@nestjs/common';

import { StatsD } from 'hot-shots';

import { DOG_STATSD_CLIENT } from './constants';

const dogStatsDClientProvider: Provider = {
  provide: DOG_STATSD_CLIENT,
  useFactory: () => {
    return new StatsD();
  },
};

@Module({
  providers: [dogStatsDClientProvider],
  exports: [DOG_STATSD_CLIENT],
})
export class DogStatsDModule {}
