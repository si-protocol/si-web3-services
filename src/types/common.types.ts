export interface IHandlePay {
  reqPay(pay: any): Promise<any>;
  respPay(pay: any): Promise<any>;
}
