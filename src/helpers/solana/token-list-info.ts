import { getMint } from '@solana/spl-token';
import * as web3 from '@solana/web3.js';

export class TokenInformation {
  readonly alias: string;
  readonly pubkey: web3.PublicKey;
  readonly decimals: number;

  constructor(alias: string, pubkey: web3.PublicKey, decimals: number) {
    this.alias = alias;
    this.pubkey = pubkey;
    this.decimals = decimals;
  }

  convertSizeToQuantity(size: number): number {
    const decimalMultiplier = 10 ** this.decimals;
    const tokenQuantity = size * decimalMultiplier;
    return Math.floor(tokenQuantity);
  }

  convertQuantityToSize(quantity: number): number {
    const decimalMultiplier = 10 ** this.decimals;
    const tokenSize = quantity / decimalMultiplier;
    return tokenSize;
  }

  static async queryTokenInformationFromPubkey(pubkey: web3.PublicKey, connection: web3.Connection): Promise<TokenInformation> {
    try {
      const mint = await getMint(connection, pubkey, 'confirmed');
      return new TokenInformation(mint.address.toBase58(), mint.address, mint.decimals);
    } catch {
      throw new Error('Token does not exist.');
    }
  }
}
