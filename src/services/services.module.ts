import { Module } from '@nestjs/common';

import { ModelsModule } from '@src/models';
import { ConfigService } from './config';

const services = [
  ConfigService,
];

@Module({
  imports: [ModelsModule],
  providers: services,
  exports: services,
})
export class ServicesModule {}
