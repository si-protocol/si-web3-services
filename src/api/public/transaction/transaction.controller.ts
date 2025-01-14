import { Controller, UseGuards, Param, Req, Get, Post, Body, HttpCode, Query, BadRequestException, BadGatewayException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { SignPayTransactionDto, SignTransactionRes} from './dto';
import { Transaction, PublicKey, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, NATIVE_MINT } from '@solana/spl-token';
import { PayChannel, PayCurrency } from '@src/common';
import * as bs58 from 'bs58';
import { Logger } from 'nestjs-pino';
import { SolTransaction, TokenInformation } from '@src/helpers/solana';
import { ConfigService } from '@src/services';
import BigNumber from 'bignumber.js';
import type { Request } from 'express';
;


@ApiTags('transaction')
@Controller('/transaction')
export class TransactionController {
  private solTransaction: SolTransaction;
  constructor(
    private readonly logger: Logger,
    private readonly configSrv: ConfigService,

  ) {
    this.solTransaction = new SolTransaction();
  }


  @ApiOperation({ operationId: 'sign-pay-transaction', summary: 'Generate payment unsinged transaction' })
  @ApiOkResponse({ type: SignTransactionRes })
  @HttpCode(200)
  @ApiBody({
    type: SignPayTransactionDto,
  })
  @Post('/sign-pay')
  async payTransaction(@Body() param: SignPayTransactionDto) {
    try {
      console.log('pay-transaction request: ', param);

      if (param.channel === PayChannel.SOL) {
        return await this.payBySolana(param);
      } else {
        throw new Error('Invalid channel: ' + param.channel);
      }
    } catch (error: any) {
      console.log('pay-transaction error:', error);
      return new BadRequestException(error.message);
    }
  }
  
  @ApiOperation({ operationId: 'sign-withdraw-transaction', summary: 'Generate withdraw unsinged transaction' })
  @ApiOkResponse({ type: SignTransactionRes })
  @HttpCode(200)
  @ApiBody({
    type: SignPayTransactionDto,
  })
  @Post('/sign-withdraw')
  async withdrawTransaction(@Body() param: SignPayTransactionDto) {
    try {
      console.log('withdraw-transaction request: ', param);

      if (param.channel === PayChannel.SOL) {
        return await this.withdrawBySolana(param);
      } else {
        throw new Error('Invalid channel: ' + param.channel);
      }
    } catch (error: any) {
      console.log('withdraw-transaction error:', error);
      return new BadRequestException(error.message);
    }
  }

  async payBySolana(param: SignPayTransactionDto) {
    if (param.channel !== PayChannel.SOL) {
      throw new Error('Invalid channel: ' + param.channel);
    }
    // Build the payment transaction
    const receiver = new PublicKey(this.configSrv.getSolanaPlatformAccount());
    const sender = new PublicKey(param.account);
    if(sender.toBase58() === receiver.toBase58()) {
      throw new Error('Sender and receiver are the same');
    }
    const feePayer = Keypair.fromSecretKey(bs58.decode(this.configSrv.getSolanaFeePayerPrivateKey()));
    console.log('feePayer: ', feePayer.publicKey.toBase58());

    let transaction: Transaction;
    const amount = BigInt(new BigNumber(param.amount).shiftedBy(param.tokenDecimals).toFixed());
    if (param.tokenAddress !== NATIVE_MINT.toBase58()) {
      const tokenPubkey = new PublicKey(param.tokenAddress);
      const receiverAta = await getAssociatedTokenAddress(tokenPubkey, receiver);
      const token = new TokenInformation(param.tokenSymbol, tokenPubkey, param.tokenDecimals);
      transaction = await this.solTransaction.buildTransferTokenTransaction(sender, receiver, receiverAta, token, amount, true, feePayer.publicKey);
    } else {
      // Pay by SOL
      if(param.tokenDecimals !== 9    ) {
        throw new Error('Invalid token decimals: ' + param.tokenDecimals);
      }
      transaction = await this.solTransaction.buildTransferSolTransaction(sender, receiver, amount, feePayer.publicKey);
    }

    // Serialize and deserialize the transaction. This ensures consistent ordering of the account keys for signing.
    transaction = Transaction.from(
      transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      }),
    );

    // Generate signature
    transaction.partialSign(feePayer);

    const txhash = bs58.encode(Uint8Array.from(transaction.signature));

    // Serialize and return
    const base = transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');
    console.log('pay-transaction response: ', { txhash: txhash });
    return { transaction: base, txhash: txhash };
  }
  
  async withdrawBySolana(param: SignPayTransactionDto) {
    if (param.channel !== PayChannel.SOL) {
      throw new Error('Invalid channel: ' + param.channel);
    }
    // Build the withdraw transaction
    const receiver = new PublicKey(param.account);
    const sender = Keypair.fromSecretKey(bs58.decode(this.configSrv.getSolanaWithdrawPrivateKey()));
    console.log('sender: ', sender.publicKey.toBase58());
    if(sender.publicKey.toBase58() === receiver.toBase58()) {
      throw new Error('Sender and receiver are the same');
    }
    const feePayer = Keypair.fromSecretKey(bs58.decode(this.configSrv.getSolanaFeePayerPrivateKey()));
    console.log('feePayer: ', feePayer.publicKey.toBase58());

    let transaction: Transaction;
    let bAmount = new BigNumber(param.amount).shiftedBy(param.tokenDecimals);
    const feeRate = this.configSrv.getSolanaWithdrawFeeRate();
    if (feeRate !== 0) {
      bAmount = bAmount.multipliedBy(new BigNumber(1).minus(feeRate));
    }
    const amount = BigInt(bAmount.toFixed());
    if (param.tokenAddress !== NATIVE_MINT.toBase58()) {
      const tokenPubkey = new PublicKey(param.tokenAddress);
      const receiverAta = await getAssociatedTokenAddress(tokenPubkey, receiver);
      const token = new TokenInformation(param.tokenSymbol, tokenPubkey, param.tokenDecimals);
      transaction = await this.solTransaction.buildTransferTokenTransaction(sender.publicKey, receiver, receiverAta, token, amount, true, feePayer.publicKey);
    } else {
      // Pay by SOL
      if(param.tokenDecimals !== 9    ) {
        throw new Error('Invalid token decimals: ' + param.tokenDecimals);
      }
      transaction = await this.solTransaction.buildTransferSolTransaction(sender.publicKey, receiver, amount, feePayer.publicKey);
    }

    // Serialize and deserialize the transaction. This ensures consistent ordering of the account keys for signing.
    transaction = Transaction.from(
      transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      }),
    );

    // Generate signature
    transaction.sign(feePayer, sender);

    const txhash = bs58.encode(Uint8Array.from(transaction.signature));

    // Serialize and return
    const base = transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');
    return { transaction: base, txhash: txhash };
  }
  
}
