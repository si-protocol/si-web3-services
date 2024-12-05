import { sign, verify, md5, xorEncrypt, xorDecrypt } from '../src/utils/crypto';
import { generateSN } from '../src/utils/hash';
// import dotenv from 'dotenv';

// dotenv.config();
jest.setTimeout(30000);

describe('Crypto', () => {
  let res: any;
  beforeEach(async () => {
    console.log('beforeEach');
  });

  afterEach(async () => {
    console.log('afterEach');
    // clean
  });

  it('md5', async () => {
    res = 'admin';
    res = md5(res);
    console.log('pwd admin:', res);
    res = md5(res);
    console.log('pwd admin2:', res);
    res = '123456';
    res = md5(res);
    console.log('pwd 123456:', res);
    res = md5(res);
    console.log('pwd2 123456:', res);
  });
  it('uuid', async () => {
    res = generateSN();
    console.log('sn:', res);
  });
  it('xorEncrypt', async () => {
    const data = '123456Alsi8d9alkxlooiPPOucwc=w_as-';
    console.log('data:', data);
    const key = '123456';
    res = xorEncrypt(data, key);
    console.log('xorEncrypt:', res);
    res = xorDecrypt(res, key);
    console.log('xorDecrypt:', res);
    expect(res).toBe(data);
  });
});
