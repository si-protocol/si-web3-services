import { SolTransaction, TokenInformation } from '../../src/helpers/solana';
import * as bs58 from 'bs58';
import * as web3 from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { USDC_DEV_PUBKEY, USDC_PUBKEY } from '../../src/config';

describe('solana-service', () => {
  const solTransaction: SolTransaction = new SolTransaction();

  describe('dev net', async () => {
    it('fetch dev transaction sended and success', async () => {
      const signature = '4NWUF65zTqLtmrcpvr2DScXbtzz9CRn9RD5WdGYYfbEU9yurmLNsVdKf8LJwf3C7z7WRdJGLEif5fB6QsSMBGkQD';
      const status = await solTransaction.fetchTransaction(signature);
      console.log('======status: ', status);
    });

    it('fetch dev transaction unsend', async () => {
      const signature = '2e3dqTCob6DJavV31owNt1Y4JYB86Leqhikf4JChdTmBDgqBY8BPh8ocsibobLmc54cgg64jxKpsNkjRnPcuqSXR';
      const status = await solTransaction.fetchTransaction(signature);
      console.log('======status: ', status);
    });

    it('fetch dev transaction sended but failed', async () => {
      const signature = '4ACGrWxMe2aJUVYd1Rd8ztvBBsrMrCkL5hgFm7Kn4AWKxJbKzrbN1Ks3YB96JW71Hzq3KkCBmT2PK2seEEPBjVdy';
      const status = await solTransaction.fetchTransaction(signature);
      console.log('======status: ', status);
    });

    it('sendRawTransaction usdc', async () => {
      const senderPrivateKey = '';
      const receiverPublicKey = '8LjCkGaHnti5YWZ4nwfVqH5Tn8bJBUM7VCe44dF7e4zS';
      const sender = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const feePayer = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const receiver = new web3.PublicKey(receiverPublicKey);
      const receiverAta = await getAssociatedTokenAddress(USDC_DEV_PUBKEY, receiver);
      const quantity = BigInt(1);
      const token = new TokenInformation('usdc', USDC_DEV_PUBKEY, 6);

      const transaction = await solTransaction.buildTransferTokenTransaction(sender.publicKey, receiver, receiverAta, token, quantity, true, feePayer.publicKey);

      transaction.sign(feePayer, sender);
      console.log('====signature', bs58.encode(transaction.signature));

      const res = await solTransaction.sendRawTransaction(transaction);
      console.log('=======res: ', res);
    });
  });

  describe('main net', async () => {
    it('fetch main transaction unsended', async () => {
      const signature = '4ACGrWxMe2aJUVYd1Rd8ztvBBsrMrCkL5hgFm7Kn4AWKxJbKzrbN1Ks3YB96JW71Hzq3KkCBmT2PK2seEEPBjVdy';
      const status = await solTransaction.fetchTransaction(signature);
      console.log('======status: ', status);
    });

    it('fetch main transaction sended but failed', async () => {
      const signature = '4siygRGjtPHN6oivF21PVCbPJA4EsJtu4dpktzncp2UQHtzPuEVPtfqJu9yoWbukiwgNmbWYSvsc2YcD7zE64eoz';
      const status = await solTransaction.fetchTransaction(signature);
      console.log('======status: ', status);
    });

    it('fetch main transaction success', async () => {
      const signature = '5Y39iRuLph3kpuyKYbPzwBEKUmMk4N6Bhqx7TiD1EVxk3tfAHVgGjFrYCeH4RuTNaw3nJs3khFtUFvaMgy9EAcsF';
      const res = await solTransaction.fetchTransaction(signature);
      console.log('=========not res: ', res);
    });
  });
});
