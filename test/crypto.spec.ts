import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { sign, verify, md5 } from '../src/utils/crypto';
import { generateSN } from '../src/utils/hash';
import dotenv from 'dotenv';

dotenv.config();
jest.setTimeout(30000);

describe('Crypto', () => {
  let res: any;
  let service: ConfigService;
  beforeEach(async () => {
    console.log('beforeEach');
    const module: TestingModule = await Test.createTestingModule({
      // eslint-disable-next-line prettier/prettier
      imports: [
        ConfigModule.forRoot()
      ],
      providers: [
        ConfigService,
        // {
        //   provide: ConfigService,
        //   useValue: createMock<ConfigService>({}),
        // },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
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
});
