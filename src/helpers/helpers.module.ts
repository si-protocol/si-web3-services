import { Module } from '@nestjs/common';

import { ServicesModule } from '@src/services';

@Module({
  imports: [ServicesModule],
  providers: [],
  exports: [],
})
export class HelpersModule {}
