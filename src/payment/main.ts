import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { sleep } from 'sleep-ts';

async function bootstrap(chainId: string|number) {
  console.log('run payment log task begin, chainId:', chainId);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  logger.log(`run payment log task begin, chainId: ${chainId}`);
  // run daily income
  logger.log(`run payment log task, chainId: ${chainId}`);
}

bootstrap(process.argv[2])
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
