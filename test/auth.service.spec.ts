import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '@src/services';
import { md5 } from '@src/utils/crypto';

import dotenv from 'dotenv';
import { ethers, Wallet } from 'ethers';

dotenv.config();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // eslint-disable-next-line prettier/prettier
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>({}),
          // useValue: {
          //   signAsync: jest.fn().mockResolvedValue('mockToken'),
          // },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('base', async () => {
    console.log('base');
    if (process.env.WALLET_PRIVATE_KEY) {
      const pwd = 'admin';
      console.log('pwd:', md5(pwd));
      const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY);
      console.log('wallet address:', wallet.address);
      const message = Date.now().toString();
      console.log('message:', message);
      const signature = await wallet.signMessage(message);
      console.log('signature:', signature);
      const res = await service.validateUserBySignature(message, signature);
      console.log('res:', res);
    } else {
      console.log('no wallet key');
    }
  });
});
