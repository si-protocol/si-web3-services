import { ApiProperty } from '@nestjs/swagger';
import { chainId2PayChannel, PayChannel } from '@src/common';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum} from 'class-validator';

export class SignPayTransactionDto {
  @ApiProperty({ required: true, nullable: false, example: '', description: 'payer waller address' })
  @IsString()
  @IsOptional()
  account: string;

  @ApiProperty({ required: true, nullable: false, example: '', description: 'transaction channel' })
  @Transform(({ value }) => {
    return chainId2PayChannel(value);
  })
  @IsEnum(PayChannel)
  channel: PayChannel;

  @ApiProperty({ required: true, nullable: false, example: 'USDC', description: 'token symbol' })
  @IsString()
  tokenSymbol: string;

  @ApiProperty({ required: true, nullable: false, example: '', description: 'token address' })
  @IsString()
  tokenAddress: string;

  @ApiProperty({ required: true, nullable: false, example: '', description: 'token decimals' })
  @IsNumber()
  tokenDecimals: number;

  @ApiProperty({ required: false, nullable: false, example: '1.8', description: 'amount, no decimals' })
  @IsString()
  @Type(() => String)
  @Transform(({ value }) => {
    return String(value);
  })
  amount: string;
}

export class SignWithdrawTransactionDto extends SignPayTransactionDto {

}


export class SignTransactionRes {
  @ApiProperty({ required: true, nullable: false, example: '', description: 'unsigned transaction' })
  @IsString()
  transaction: string;

  @ApiProperty({ required: true, nullable: false, example: '', description: 'transaction hash' })
  @IsString()
  txhash: string;
}
