import { Module } from '@nestjs/common';

import { ServicesModule } from '@src/services';
import { SolTransaction } from '@src/helpers/solana/transaction';

@Module({
  imports: [ServicesModule],
  providers: [SolTransaction],
  exports: [SolTransaction],
})
export class HelpersModule {}
