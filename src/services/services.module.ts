import { Module } from '@nestjs/common';

import { ModelsModule } from '@src/models';


const services = [
];

@Module({
  imports: [ModelsModule],
  providers: services,
  exports: services,
})
export class ServicesModule {}
