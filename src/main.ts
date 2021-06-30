import * as compression from 'compression';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import ConfigService from './config/config.service';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@hqo/shared-modules/dist';
import { outboundLogger } from './logging/outbound-logger';
import { setupTracer } from './logging/setup-tracer';
import { AllExceptionsFilter } from './filters/all-exceptions-filter';

setupTracer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(compression());

  outboundLogger.initialize();

  const configService: ConfigService = app.get(ConfigService);

  // Setup validation for api requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Setup exceptions handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup global express middleware
  app.enableCors();

  // Only enable api explorer for development environments
  if (configService.get('DEBUG') === 'true' || configService.get('NODE_ENV') === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Hello Nest Node API')
      .setDescription('Sample NestJS API')
      .setVersion('0.1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('explorer', app, document);
  }

  await app.listen(3000);
}
bootstrap();
