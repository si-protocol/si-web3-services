import { BaseEntity, ApiProperty, Prop, Decimal } from './base.entity';
import { PayChannel } from '@src/common';

export enum TransactionType {
  payment = 'payment',
  deposit = 'deposit',
  withdraw = 'withdraw',
  refund = 'refund',
  cloudPayment = 'cloudPayment',
  aiPayment = 'aiPayment',
}

export enum TransactionStatus {
  submit = 'submit',
  pending = 'pending',
  finished = 'finished',
  success = 'success',
  failed = 'failed',
}

export class TransactionEntity extends BaseEntity {
  @ApiProperty({ required: true, nullable: false, description: 'orderId' })
  @Prop({ required: false })
  orderId: string;

  @ApiProperty({ required: true, nullable: false, description: 'user id' })
  @Prop({ required: false })
  userId: string;

  @ApiProperty({ required: true, nullable: false, description: 'transaction txhash' })
  @Prop({ required: true })
  txhash: string;

  @ApiProperty({ required: true, nullable: false, description: 'sn, note-dev: when status is failed, it should be changed to txhash' })
  @Prop({ required: true })
  sn: string;

  @ApiProperty({ required: true, nullable: true, example: PayChannel.SOL, description: 'transaction on which chain' })
  @Prop({ required: true })
  channel: PayChannel;

  @ApiProperty({ required: false, nullable: true, example: 'USDT', description: 'pay currency' })
  @Prop({ required: false })
  currency: string;

  @ApiProperty({ required: true, nullable: false, description: 'transaction type: [payment, refund]' })
  @Prop({ required: true, enum: TransactionType, default: TransactionType.payment })
  type: TransactionType;

  @ApiProperty({ required: true, nullable: true, example: PayChannel.SOL, description: 'pay channel name' })
  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.pending })
  status: TransactionStatus;

  @ApiProperty({ required: true, nullable: false, example: 1, description: 'fetch counter' })
  @Prop({ required: true, default: 0 })
  counter: number;

  @ApiProperty({ required: false, nullable: false, example: '0', description: 'payment amount' })
  @Prop({ required: true })
  amount: Decimal;

  @ApiProperty({ required: false, nullable: true, example: '{}', description: 'transaction data' })
  @Prop({ required: false })
  data: Record<string, any>;

  @ApiProperty({ required: false, nullable: true, example: '{}', description: 'order detail' })
  @Prop({ required: false })
  orderDetail: Record<string, any>;
}
