import { SolTransaction, TokenInformation } from '../../src/helpers/solana';
import * as bs58 from 'bs58';
import * as web3 from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { SolConstants } from '../../src/helpers/solana';
import dotenv from 'dotenv';

dotenv.config();

const USDC_DEV_PUBKEY = new web3.PublicKey(SolConstants.CHAIN_TOKENS.devnet.USDC);

describe('solana-service', () => {
  const solTransaction: SolTransaction = new SolTransaction();

  describe('dev net', () => {
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
      const senderPrivateKey = process.env.SOLANA_FEEPAYER_PRIVATE_KEY;
      const receiverPublicKey = process.env.SOLANA_PALTFORM_ACCOUNT;
      const sender = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const feePayer = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const receiver = new web3.PublicKey(receiverPublicKey);
      const senderAta = await getAssociatedTokenAddress(USDC_DEV_PUBKEY, sender.publicKey);
      const receiverAta = await getAssociatedTokenAddress(USDC_DEV_PUBKEY, receiver);
      
      const token = await TokenInformation.queryTokenInformationFromPubkey(USDC_DEV_PUBKEY, solTransaction.connection);
      console.log('token: ', token);
      console.log('sender: ', sender.publicKey.toBase58());
      console.log('senderAta: ', senderAta.toBase58());
      console.log('receiver: ', receiver.toBase58());
      console.log('receiverAta: ', receiverAta.toBase58());

      const amount = BigInt(1);

      const senderTokenBalance = await getAccount(solTransaction.connection, senderAta);
      console.log('senderTokenBalance: ', senderTokenBalance.amount);


      const receiverTokenBalance = await getAccount(solTransaction.connection, receiverAta);
      console.log('receiverTokenBalance: ', receiverTokenBalance.amount);

      const solBalance = await solTransaction.connection.getBalance(sender.publicKey);
      console.log('solBalance: ', solBalance);

      const transaction = await solTransaction.buildTransferTokenTransaction(sender.publicKey, receiver, receiverAta, token, amount, true, feePayer.publicKey);

      transaction.sign(feePayer, sender);
      console.log('====signature', bs58.encode(transaction.signature));

      const res = await solTransaction.sendRawTransaction(transaction);
      console.log('=======res: ', res);
    });

    it('sendRawTransaction usdc use serialized transaction', async () => {
      const senderPrivateKey = process.env.SOLANA_FEEPAYER_PRIVATE_KEY;
      const receiverPublicKey = process.env.SOLANA_PALTFORM_ACCOUNT;
      const sender = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const feePayer = web3.Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
      const receiver = new web3.PublicKey(receiverPublicKey);
      const senderAta = await getAssociatedTokenAddress(USDC_DEV_PUBKEY, sender.publicKey);
      const receiverAta = await getAssociatedTokenAddress(USDC_DEV_PUBKEY, receiver);
      
      const token = await TokenInformation.queryTokenInformationFromPubkey(USDC_DEV_PUBKEY, solTransaction.connection);

      const amount = BigInt(1);

      const senderTokenBalance = await getAccount(solTransaction.connection, senderAta);
      console.log('senderTokenBalance: ', senderTokenBalance.amount);


      const receiverTokenBalance = await getAccount(solTransaction.connection, receiverAta);
      console.log('receiverTokenBalance: ', receiverTokenBalance.amount);

      const solBalance = await solTransaction.connection.getBalance(sender.publicKey);
      console.log('solBalance: ', solBalance);

      const transaction = await solTransaction.buildTransferTokenTransaction(sender.publicKey, receiver, receiverAta, token, amount, true, feePayer.publicKey);

      transaction.sign(feePayer, sender);
      console.log('====signature', bs58.encode(transaction.signature));

      const transactionSerialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');
      console.log('transactionSerialized: ', transactionSerialized);

      try {
          const buffer = Buffer.from(transactionSerialized, 'base64');
          const transaction = web3.Transaction.from(buffer);
          const res = await solTransaction.sendRawTransaction(transaction);
          console.log('=======res: ', res);
      } catch (error) {
        throw new Error('Failed to parse transaction string');
      }
    });
  });

  describe.skip('main net', () => {
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
