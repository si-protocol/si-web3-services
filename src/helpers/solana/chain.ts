import {
  Connection,
  PublicKey
} from "@solana/web3.js";
import { CHAIN_RPC, NATIVE_TOKEN, CHAIN_TOKENS } from './constants';
import { getMint } from '@solana/spl-token';

export class SolChain {
  chainId: string = '';
  connection: Connection;

  constructor(chainId: string, endpoint?: string) {
    this.chainId = chainId;
    const rpcUrl = endpoint || CHAIN_RPC[chainId];
    this.connection = new Connection(rpcUrl);
  }

  async getBalance(address?: string) {
    const balance = await this.connection.getBalance(new PublicKey(address));
    return balance;
  }

  async getTokenInfo(address: string) {
    if(address === NATIVE_TOKEN) {
      return {
        address,
        decimals: 9,
      }
    }
    const mint = await getMint(this.connection, new PublicKey(address));
    if(!mint) {
      throw new Error(`Token ${address} not found`);
    }
    return {
      address,
      decimals: mint.decimals,
    };
  }

  getTokenAddress(name: string) {
    if(name === 'SOL') {
      return NATIVE_TOKEN;
    }
    const address = CHAIN_TOKENS[this.chainId][name];
    if(!address) {
      throw new Error(`Token ${name} not found`);
    }
    return address;
  }
}

const _cacheSolChain = new Map<string, SolChain>();
export const getSolChain = (chainId: string, endpoint?: string) => {
  if(_cacheSolChain.has(chainId)) {
    return _cacheSolChain.get(chainId);
  }
  const solChain = new SolChain(chainId, endpoint);
  _cacheSolChain.set(chainId, solChain);
  return solChain;
}
