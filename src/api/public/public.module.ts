import { Module } from '@nestjs/common';

import { TransactionModule } from './transaction/transaction.module';


@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    TransactionModule,
  ],
})
export class PublicApisModule {}
