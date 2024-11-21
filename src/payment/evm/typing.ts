export interface IHandleLog {
  address: string;
  handleLog(log: any): Promise<any>;
}
