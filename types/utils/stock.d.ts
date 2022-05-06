export interface Stock {
  name: string;
  code: string;

  now: number;
  low: number;
  high: number;
  percent: number;
  yesterday: number;
  updateDate: string;
}

export default Stock;
