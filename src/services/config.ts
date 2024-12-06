import { ConfigService as SystemConfigService } from '@nestjs/config';
import { Injectable, Inject } from '@nestjs/common';
import { xorDecrypt } from '../utils/crypto';


@Injectable()
export class ConfigService {
  @Inject(SystemConfigService) readonly systemConfigSrv: SystemConfigService;

  getSolanaPlatformAccount() {
    return this.systemConfigSrv.get('SOLANA_PALTFORM_ACCOUNT');
  }

  getSolanaFeePayerPrivateKey() {
    const key = this.systemConfigSrv.get('SOLANA_FEEPAYER_PRIVATE_KEY');
    return xorDecrypt(key);
  }

  getSolanaWithdrawPrivateKey() {
    const key = this.systemConfigSrv.get('SOLANA_WITHDRAW_PRIVATE_KEY');
    return xorDecrypt(key);
  }

  getSolanaWithdrawFeeRate() {
    return this.systemConfigSrv.get('SOLANA_WITHDRAW_FEE_RATE');
  }
}
