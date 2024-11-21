import { BigNumber, ethers } from 'ethers';
import { v4 } from 'uuid';

export function hexToBytes32(val: string) {
  if (val.substring(0, 2) !== '0x') val = '0x' + val;
  return ethers.utils.hexZeroPad(val, 32);
}

export function bytes32ToHex(val: string, has0x: boolean = false) {
  if (val.substring(0, 2) !== '0x') val = '0x' + val;
  let res = ethers.utils.hexStripZeros(val);
  if (!has0x) res = res.substring(2);
  return res;
}

export function bigNumberJsonToString(value: any) {
  if (typeof value === 'object' && Object.keys(value).indexOf('_isBigNumber') !== -1 && Object.keys(value).indexOf('_hex') !== -1) {
    return BigNumber.from(value._hex).toString();
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = bigNumberJsonToString(value[i]);
    }
  }
  return value;
}

export function getUuid() {
  return v4().replace(/-/g, '');
}
