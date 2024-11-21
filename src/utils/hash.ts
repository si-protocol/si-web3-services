import { randomInt, randomUUID } from 'crypto';
import { isUndefined, sampleSize, sortBy } from 'lodash';

export function generateCode(len: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const pwd = sampleSize(chars, len || 1);
  return pwd.join('');
}

export function generateSN() {
  return randomUUID().replace(/-/g, '');
}

export function generateRandomCode() {
  return randomInt(1, 98); // 10 ** 10
  // return randomInt(1, 74); // 26 + 48
}

export function stringifyKeys(keys: number[]) {
  return sortBy(keys).join(',');
}
