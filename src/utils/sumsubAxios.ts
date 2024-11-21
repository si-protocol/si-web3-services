import axios from 'axios';
import CryptoJS from 'crypto-js';

const axiosIns: any = axios.create({
  baseURL: process.env.SUMSUB_URL,
});

axiosIns.defaults.responseType = 'json';

axiosIns.defaults.validateStatus = (status: number) => {
  return true;
};
axiosIns.interceptors.request.use((config: any) => {
  const SUMSUB_URL = process.env.SUMSUB_URL;
  const secretKey = process.env.SECRET_KEY;
  const stamp = Math.floor(Date.now() / 1000).toString();
  let valueToSign = stamp + config.method.toUpperCase() + config.url.toString();
  if (config.data) {
    valueToSign += JSON.stringify(config.data);
  }
  const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(valueToSign, secretKey));
  config['headers']['X-App-Token'] = process.env.APP_TOKEN;
  config['headers']['X-App-Access-Ts'] = stamp;
  config['headers']['X-App-Access-Sig'] = signature;
  return config;
});

export default axiosIns;
