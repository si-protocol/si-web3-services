import { Module } from '@nestjs/common';

import { HelpersModule } from '@src/helpers';
import { ServicesModule } from '@src/services';
import { TransactionController } from './transaction.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HelpersModule, ServicesModule, ConfigModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
