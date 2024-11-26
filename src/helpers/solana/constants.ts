import { NATIVE_MINT } from '@solana/spl-token';

export const NATIVE_TOKEN = NATIVE_MINT.toBase58();

// https://solana.com/rpc
export const CHAIN_RPC: any = {
  'mainnet': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
};

export const CHAIN_NAME: any = {
  'mainnet': 'Solana Chain Mainnet',
  'devnet': 'Solana Chain Devnet',
};

export const CHAIN_TOKENS: any = {
  'mainnet': {
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  'devnet': {
    USDT: 'DLog4n39QYwZ8DZRFzZV59WFRfDc6nbGsBiBZUdHSMXX',
    USDC: 'ARUn7NWoHLcEnrw3jXZX78RSpW7rQiZ4Tsq99wAT8tgC',
  },
};
