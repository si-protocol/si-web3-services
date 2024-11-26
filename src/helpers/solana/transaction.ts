import * as web3 from '@solana/web3.js';
import { createTransferCheckedInstruction } from '@solana/spl-token';
import { TokenInformation } from './token-list-info';
import { createAssociatedTokenAccountInstruction, findAssociatedTokenAddress } from '../../utils';
import { Injectable } from '@nestjs/common';
import { CHAIN_RPC } from './constants';

const NO_RPC_URL_ERROR_MESSAGE = 'Could not make a valid RPC connection.';

export enum OnChainTransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Injectable()
export class SolTransaction {
  connection: web3.Connection;

  constructor(rpcUrl?: string) {
    if(!rpcUrl) {
      rpcUrl = CHAIN_RPC.devnet;
    }
    console.log('rpcUrl: ', rpcUrl);
    this.connection = new web3.Connection(rpcUrl);
  }

  async buildTransferTokenTransaction(
    sender: web3.PublicKey,
    receiverWalletAddress: web3.PublicKey | null,
    receiverTokenAddress: web3.PublicKey | null,
    token: TokenInformation,
    quantity: bigint,
    createAta: boolean,
    feePayer: web3.PublicKey | null,
  ): Promise<web3.Transaction> {
    const transaction: web3.Transaction = new web3.Transaction();
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const transferIxs: web3.TransactionInstruction[] = [];

    const senderTokenAddress: web3.PublicKey = await findAssociatedTokenAddress(sender, token.pubkey);

    const finalReceiverTokenAddress: web3.PublicKey = await this.getFinalReceiverTokenAddress(receiverWalletAddress, receiverTokenAddress, token);

    const info = await this.connection.getAccountInfo(finalReceiverTokenAddress);

    if (createAta && info == null) {
      if (receiverWalletAddress == null) {
        throw new Error('Receiver wallet address cannot be null if you need to create the ata.');
      }

      if (feePayer == null) {
        throw new Error('Fee payer cannot be null');
      }

      const createAssociatedInstruction = createAssociatedTokenAccountInstruction(finalReceiverTokenAddress, feePayer, receiverWalletAddress, token.pubkey);

      transferIxs.push(createAssociatedInstruction);
    }

    const transfer = createTransferCheckedInstruction(senderTokenAddress, token.pubkey, finalReceiverTokenAddress, sender, quantity, token.decimals);

    transferIxs.push(transfer);

    transaction.add(...transferIxs);

    return transaction;
  }

  async buildTransferSolTransaction(
    sender: web3.PublicKey, //
    receiverWalletAddress: web3.PublicKey | null,
    quantity: bigint,
    feePayer: web3.PublicKey | null,
  ): Promise<web3.Transaction> {
    const transaction: web3.Transaction = new web3.Transaction();
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    transaction.add(
      web3.SystemProgram.transfer({
        fromPubkey: sender!,
        toPubkey: receiverWalletAddress,
        lamports: quantity,
      }),
    );

    return transaction;
  }

  async sendRawTransaction(transaction: web3.Transaction): Promise<string> {
    return await this.connection.sendRawTransaction(transaction.serialize());
  }

  async sendTransaction(transaction: web3.Transaction, signers: web3.Signer[]): Promise<string> {
    return await this.connection.sendTransaction(transaction, signers);
  }

  async getFinalReceiverTokenAddress(receiverWalletAddress: web3.PublicKey | null, receiverTokenAddress: web3.PublicKey | null, token: TokenInformation): Promise<web3.PublicKey> {
    let finalReceiverTokenAddress: web3.PublicKey | null = null;
    if (receiverWalletAddress == null && receiverTokenAddress == null) {
      throw new Error('Receiver wallet address and receiver token address cannot both be null.');
    } else if (receiverTokenAddress == null && receiverWalletAddress != null) {
      finalReceiverTokenAddress = await findAssociatedTokenAddress(receiverWalletAddress, token.pubkey);
    } else if (receiverTokenAddress != null && receiverWalletAddress == null) {
      finalReceiverTokenAddress = receiverTokenAddress;
    } else if (receiverTokenAddress != null && receiverWalletAddress != null) {
      const tempAssociatedTokenAddress = await findAssociatedTokenAddress(receiverWalletAddress, token.pubkey);
      if (receiverTokenAddress.toBase58() != tempAssociatedTokenAddress.toBase58()) {
        throw new Error('Receiver wallet address and r eceiver token address do not match.');
      }
      finalReceiverTokenAddress = receiverTokenAddress;
    }

    if (finalReceiverTokenAddress == null) {
      throw new Error('Could not get final receiver token address.');
    }

    return finalReceiverTokenAddress;
  }

  async fetchTransaction(transactionId: string): Promise<OnChainTransactionStatus> {
    try {
      const res: any = await this.connection.getTransaction(transactionId, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
      if (!res) {
        return OnChainTransactionStatus.PENDING;
      } else if (res.transaction && Object.keys(res.meta.status).includes('Err')) {
        return OnChainTransactionStatus.FAILED;
      } else if (res.transaction && Object.keys(res.meta.status).includes('Ok')) {
        return OnChainTransactionStatus.SUCCESS;
      } else {
        return OnChainTransactionStatus.PENDING;
      }
    } catch (error) {
      // TODO check why failed
      console.log('==============error', error);
      return null;
    }
  }
}
