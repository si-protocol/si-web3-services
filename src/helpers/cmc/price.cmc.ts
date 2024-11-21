import axios from 'axios';
import BigNumber from 'bignumber.js';
import { throwError } from 'rxjs';

export const getPrice = async (currencyId: string): Promise<string> => {
  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&id=${currencyId}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        Accept: 'application/json',
      },
    });
    const price = new BigNumber(response.data.data.quote.USD.price).toFixed(4, 1);
    return price;
  } catch (error) {
    console.error('CMC get token price error: ', error);
    return '0';
  }
};

export const getInfo = async (contractAddr: string): Promise<any> => {
  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${contractAddr}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        Accept: 'application/json',
      },
    });

    if (response.data.status.error_code !== 0) {
      throw new Error(response.data.status.error_message);
    }

    if (Object.values(response.data.data).length == 0) {
      throw new Error('The token does not existed');
    }

    return Object.values(response.data.data)[0];
  } catch (error) {
    console.error('CMC get token info error: ', error);
    return null;
  }
};
