import ConfigService from '../config/config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonTypeormLogger } from '@hqo/nestjs-winston-logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.DB_HOST,
        port: configService.DB_PORT,
        username: configService.DB_USER,
        password: configService.DB_PASSWORD,
        database: configService.DB_NAME,
        autoLoadEntities: true,
        logger: new WinstonTypeormLogger(),
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export default class DatabaseModule {}
