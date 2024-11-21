import crypto from 'crypto';
import { ethers } from 'ethers';

export function md5(text: any) {
  return crypto.createHash('md5').update(text).digest('hex');
}

export function sha256(data: any): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function hash(val: string): string {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(val));
}

export function generateUniqueCode(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += characters[randomBytes[i] % charactersLength];
  }
  return result;
}

export function sign(privateKey: string, data: crypto.BinaryLike, algo: string = 'RSA-SHA256'): string {
  const signer = crypto.createSign(algo);
  signer.update(data);
  return signer.sign(privateKey, 'base64');
}

export function verify(publicKey: string, data: crypto.BinaryLike, signature: string, algo: string = 'RSA-SHA256'): boolean {
  const verifier = crypto.createVerify(algo);
  verifier.update(data);
  return verifier.verify(publicKey, signature, 'base64');
}
