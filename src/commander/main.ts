
import yargs from 'yargs';
import { xorEncrypt } from '../utils/crypto';

async function runXorEncrypt(data: string) {
  const res = xorEncrypt(data);
  console.log('xorEncrypt:', res);
}


const parser = yargs
  .command('xorEncrypt', 'xor encrypt', (yargs) => {
    return yargs
      .option('data', {
        alias: 'd',
        describe: 'data',
        type: 'string',
        demandOption: true
      })
  })
  .demandCommand(1, 'You need to specify a command')
  .strict()
  .help()
  .alias('h', 'help');

async function main() {
  try {
    console.log('start...');
    const argv = await parser.argv;
    console.log('argv:', argv);
    const cmd = argv._[0];
    console.log('cmd:', cmd);
    
    if (cmd === 'xorEncrypt') {
      await runXorEncrypt(argv.data);
    } else {
      console.error('invalid command');
      parser.help();
    }
  } catch (e: any) {
    console.error('except:', e);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
