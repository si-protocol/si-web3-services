import { Controller, UseGuards, Param, Req, Get, Post, Body, HttpCode, Query, BadRequestException, BadGatewayException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { SignTransactionDto, SignTransactionRes} from './dto';
import { Transaction, PublicKey, Keypair } from '@solana/web3.js';
import { USDC_PUBKEY, USDC_DEV_PUBKEY } from '@src/config/pubkeys.config';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { TransactionType, TransactionStatus } from '@src/models';
import { PayChannel, PayCurrency } from '@src/common';
import * as bs58 from 'bs58';
import { Logger } from 'nestjs-pino';
import { SolTransaction, TokenInformation, OnChainTransactionStatus } from '@src/helpers/solana';
import { ConfigService as SystemConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';
import { getUuid } from '@src/utils/contract';
import type { Request } from 'express';
import { getChain, ERC20 } from '@src/payment/evm';
import { chainId2PayChannel } from '@src/common';


@ApiTags('transaction')
@Controller('/transaction')
export class TransactionController {
  private solTransaction: SolTransaction;
  constructor(
    private readonly logger: Logger,
    private readonly sysConfigSrv: SystemConfigService,

  ) {
    this.solTransaction = new SolTransaction();
  }


  @ApiOperation({ operationId: 'pay-transaction', summary: 'Generate payment unsinged transaction' })
  @ApiOkResponse({ type: SignTransactionRes })
  @HttpCode(200)
  @ApiBody({
    type: SignTransactionDto,
  })
  @Post('/sign-transaction')
  async payTransaction(@Query('orderId') orderId: string, @Query('type') type: TransactionType, @Body() param: SignTransactionDto) {
    try {
      param.type = type;
      this.logger.log('pay-transaction request: ', orderId, param);

      // Get the order record from db
      let orderRecord: any = param.orderDetail;
      if (!orderRecord) {
        throw new Error('Invalid orderId: ' + orderId);
      }

      const channel = param.channel || orderRecord.payChannel;
      if (channel === PayChannel.SOL) {
        return await this.payBySolana(param);
      } else {
        throw new Error('Invalid channel: ' + channel);
      }
    } catch (error: any) {
      console.log('pay-transaction error:', error);
      return new BadRequestException(error.message);
    }
  }
  


  async payBySolana(param: SignTransactionDto) {
    const orderId = param.orderDetail.id.toString();
    // Build the payment transaction
    const sender = new PublicKey(param.account);
    const receiver = new PublicKey(this.sysConfigSrv.get('SOLANA_PALTFORM_ACCOUNT'));
    const quantity = param.orderDetail.amount;
    const feePayer = Keypair.fromSecretKey(bs58.decode(this.sysConfigSrv.get('SOLANA_FEEPAYER_PRIVATE_KEY')));

    let transaction: Transaction;
    if (param.orderDetail.payChannel == PayChannel.SOL) {
      if (param.orderDetail.payCurrency == PayCurrency.usdc) {
        // Pay by USDC
        let usdcPubkey = USDC_DEV_PUBKEY;
        if (this.sysConfigSrv.get('SOLANA_NET') == 'MAINNET') {
          usdcPubkey = USDC_PUBKEY;
        }
        const receiverAta = await getAssociatedTokenAddress(usdcPubkey, receiver);
        const token = new TokenInformation('USDC', usdcPubkey, 6);
        transaction = await this.solTransaction.buildTransferTokenTransaction(sender, receiver, receiverAta, token, BigInt(new BigNumber(quantity).shiftedBy(6).toFixed()), true, feePayer.publicKey);
      } else {
        // Pay by SOL
        transaction = await this.solTransaction.buildTransferSolTransaction(sender, receiver, BigInt(new BigNumber(quantity).shiftedBy(9).toFixed()), feePayer.publicKey);
      }
    } else {
      throw new Error('Sorry, currently only supports Solana payment.');
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
    return { transaction: base, txhash: txhash };
  }
}
