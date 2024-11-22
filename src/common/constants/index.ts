import type { ConfigService } from '@nestjs/config';
export * from './keys';

export enum Action {
  add = '__add',
  edit = '__edit',
}

export enum Status {
  open = 'open',
  stop = 'stop',
  close = 'close',
}

export enum TimeUnit {
  years = 'y',
  quarters = 'Q',
  months = 'M',
  weeks = 'w',
  days = 'd',
  hours = 'h',
  minutes = 'm',
  seconds = 's',
}

export enum PayChannel {
  BALANCE = 'BALANCE',
  SOL = 'SOL',
  ETH = 'ETH',
  BSC = 'BSC',
  ADMIN = 'ADMIN',
  NONE = '',
}

export enum PayCurrency {
  usdc = 'USDC',
}

export enum SettleStatus {
  unsettled = 'unsettled',
  partial = 'partial',
  full = 'full',
}

export function getPayChannel(channelStr: string): PayChannel {
  if (channelStr in PayChannel) {
    return PayChannel[channelStr as keyof typeof PayChannel];
  }
  throw new Error('Invalid channel');
}

export const TOLERANCE = 0.0000001;

export const CurrencyList = ['SOL:USDC', 'SOL:SOL', 'ETH:USDC', 'BSC:USDC', 'ETH:USDT', 'BSC:USDT'];

export function chainId2PayChannel(chainId: number | string): PayChannel {
  console.log('chainId2PayChannel: ', chainId);
  if (['56', '97'].includes(String(chainId))) {
    return PayChannel.BSC;
  } else if (['1', '11155111'].includes(String(chainId))) {
    return PayChannel.ETH;
  } else if (String(chainId).substring(0,3).toUpperCase() === 'SOL') {
    return PayChannel.SOL;
  } else if (chainId === 'ADMIN') {
    return PayChannel.ADMIN;
  } else {
    return toPayChannel(String(chainId));
  }
}

function toPayChannel(value: string): PayChannel {
  if (Object.values(PayChannel).includes(value as PayChannel)) {
    return value as PayChannel;
  }
  throw new Error('Invalid channel value: '+ value);
}

export function projectWeightBase(configSrv: ConfigService) {
  return Number(configSrv.get('PROJECT_WEIGHT_BASE') || '100000');
}

export function getPlatformReceiver(configSrv: ConfigService, channel: PayChannel) {
  if (channel === PayChannel.SOL) {
    return configSrv.get('SOLANA_PALTFORM_ACCOUNT');
  } else if (channel === PayChannel.ETH) {
    return configSrv.get('EVM_PALTFORM_ACCOUNT');
  } else if (channel === PayChannel.BSC) {
    return configSrv.get('EVM_PALTFORM_ACCOUNT');
  }
  throw new Error('Invalid channel: ' + channel);
}