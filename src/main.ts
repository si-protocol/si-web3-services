// eslint-disable-next-line simple-import-sort/imports
import { otelSDK } from './tracing'; // Make sure it's the first line
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  otelSDK.start();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);

  const configService = app.get(ConfigService);

  const NODE_ENV: string = configService.get('NODE_ENV');
  const HTTP_PORT: string = configService.get('HTTP_PORT');
  const REDIS_URL: string = configService.get('REDIS_URL');
  const REDIS_DB: string = configService.get('REDIS_DB');
  const SESSION_SECRET: string = configService.get('SESSION_SECRET');
  const EVM_CHAIN_LIST: string = configService.get('EVM_CHAIN_LIST');
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: SESSION_SECRET || v4(),
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(logger);
  app.enableCors();
  app.disable('x-powered-by');
  app.use(compression());

  // Swagger
  const options = new DocumentBuilder().setTitle('si.online - API description').setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(HTTP_PORT);
}

bootstrap();
