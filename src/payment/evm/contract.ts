import { Contract, ethers, providers } from 'ethers';
import type { Signer } from './common/types';
import { Chain } from './chain';

export class BaseContract {
  // Provides the raw interface to the contract for flexibility
  public contract: Contract;
  public address: string;

  public chain: Chain;
  public provider: ethers.providers.Provider;

  public constructor(chain: Chain, address: string, abi: any) {
    if (!chain) {
      throw new Error('invalid chain');
    }
    if (!address) {
      throw new Error('invalid address');
    }
    if (!abi) {
      throw new Error('invalid abi');
    }

    this.chain = chain;
    this.address = address.toLowerCase();

    const provider = chain.getProvider();

    if (!provider) {
      throw new Error('Either a provider or custom signer with provider must be provided');
    }

    this.provider = provider;

    this.contract = new Contract(address, abi, this.provider);

    this.chain.register(this);

    if (this.provider instanceof providers.JsonRpcProvider) {
      // console.debug('contract constructor connect', this.address);
      this.connect();
    } else {
      // console.debug('no signer contract ', this.address);
    }
  }

  public connect(signer?: Signer) {
    try {
      if (!signer) signer = this._getSigner(0);
      // console.log('contract connect', signer);
      this.contract = this.contract.connect(signer);
    } catch (e) {
      console.error('contract connect except', e);
    }

    return this;
  }

  public _getSigner(addressOrIndex?: string | number): Signer {
    return this.chain.getSigner(addressOrIndex);
  }

  async getEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter: any = {
      address: this.address,
    };
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }
}
