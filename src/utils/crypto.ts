import crypto from 'crypto';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

let XOR_KEY = '';
try {
  XOR_KEY = fs.readFileSync(path.join(__dirname, '../../.xor.key'), 'utf8');
} catch (e) {
  console.error('No xor key file found');
}

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

export function xorEncrypt(data: string, key: string =''): string {
  key += XOR_KEY;
  // Convert data and key to Buffer for XOR operation
  const dataBuffer = Buffer.from(data, 'utf8');
  const keyBuffer = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(dataBuffer.length);

  // XOR each byte of data with corresponding byte of key (with wrapping)
  for (let i = 0; i < dataBuffer.length; i++) {
    result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  // Return base64 encoded result
  return result.toString('base64');
}

export function xorDecrypt(data: string, key: string = ''): string {
  key += XOR_KEY;
  // Convert base64 data to Buffer and get key buffer
  const dataBuffer = Buffer.from(data, 'base64');
  const keyBuffer = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(dataBuffer.length);

  // XOR operation is reversible - same operation as encrypt
  for (let i = 0; i < dataBuffer.length; i++) {
    result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  // Convert result back to utf8 string
  return result.toString('utf8');
}