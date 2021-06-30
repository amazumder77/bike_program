import EnvironmentService, { environmentServiceFactory } from './environment.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentService,
      useFactory: environmentServiceFactory,
    },
  ],
  exports: [EnvironmentService],
})
export default class EnvironmentModule { }
