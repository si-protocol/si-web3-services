import { Module } from '@nestjs/common';

import { PublicApisModule } from './public/public.module';

@Module({
  imports: [PublicApisModule],
})
export class ApiModule {}
