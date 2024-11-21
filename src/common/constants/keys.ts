import { SetMetadata } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { isEqual, toLower } from 'lodash';

export const IS_PUBLIC_KEY = 'isPublic';

export const ROLES_KEY = 'roles';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function isAminAddress(configSrv: ConfigService, address: string) {
  const admins: string[] = configSrv.get('ADMINS') || [];
  return !!admins.find((item) => isEqual(toLower(item), toLower(address)));
}

export function srvPublicKey(configSrv: ConfigService) {
  const filePath = configSrv.get('SRV_PUBLIC_KEY_FILE') || '';
  const exists = fs.existsSync(filePath);
  if (!exists) {
    throw new Error(`SRV_PUBLIC_KEY_FILE file not found at path: ${filePath}`);
  }
  return fs.readFileSync(filePath);
}

export function srvPrivateKey(configSrv: ConfigService) {
  const filePath = configSrv.get('SRV_PRIVATE_KEY_FILE') || '';
  const exists = fs.existsSync(filePath);
  if (!exists) {
    throw new Error(`SRV_PRIVATE_KEY_FILE file not found at path: ${filePath}`);
  }
  return fs.readFileSync(filePath);
}

