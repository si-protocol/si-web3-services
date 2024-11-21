import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '@src/models';
import { ApiPaginationQuery, chainId2PayChannel, PayChannel } from '@src/common';
import { Transform, Type as Transformer } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum, IsObject, IsInt, Min, IsDateString } from 'class-validator';

export class SignTransactionDto {
  @ApiProperty({ required: true, nullable: false, example: '', description: 'payer waller address' })
  @IsString()
  @IsOptional()
  account: string;

  @ApiProperty({ required: false, nullable: false, example: '', description: 'transaction type' })
  @IsOptional()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ required: false, nullable: false, example: '', description: 'transaction channel' })
  @IsOptional()
  @Transform(({ value }) => {
    return chainId2PayChannel(value);
  })
  channel: PayChannel;

  @ApiProperty({ required: false, nullable: false, example: '', description: 'order detail' })
  @IsOptional()
  @IsObject()
  orderDetail: any;
}


export class SignTransactionRes {
  @ApiProperty({ required: true, nullable: false, example: '', description: 'unsigned transaction' })
  @IsString()
  transaction: string;

  @ApiProperty({ required: false, nullable: false, example: '', description: 'order id' })
  @IsString()
  @IsOptional()
  orderId: string;

  @ApiProperty({ required: true, nullable: false, example: '', description: 'paying message detail' })
  @IsString()
  message: string;

  @ApiProperty({ required: false, nullable: false, example: '', description: 'transaction status' })
  @IsNumber()
  @IsOptional()
  status: number;
}
