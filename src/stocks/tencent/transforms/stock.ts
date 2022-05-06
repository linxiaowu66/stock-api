// Stocks
import BaseStockTransform from "@stocks/base/transforms/stock";
import {
  COMMON_FUND,
  COMMON_HK,
  COMMON_SH,
  COMMON_US,
} from "@stocks/base/utils/constant";

// Utils
import { DEFAULT_STRING, DEFAULT_NUMBER } from "@utils/constant";

// Types
import Stock from "types/utils/stock";

/**
 * 腾讯股票数据解析
 */
class TencentStockTransform extends BaseStockTransform {
  /**
   * 构造函数
   */
  constructor(public code: string, public params: string[]) {
    super();
  }

  /**
   * 获取代码
   */
  getCode(): string {
    return String(this.code).toUpperCase();
  }

  /**
   * 获取名称
   */
  getName(): string {
    return String(this.params[1] || DEFAULT_STRING);
  }

  /**
   * 获取现价
   */
  getNow(): number {
    return Number(this.params[3] || DEFAULT_NUMBER);
  }

  /**
   * 获取最低价
   */
  getLow(): number {
    return Number(this.params[34] || DEFAULT_NUMBER);
  }

  /**
   * 获取最高价
   */
  getHigh(): number {
    return Number(this.params[33] || DEFAULT_NUMBER);
  }

  /**
   * 获取昨日收盘价
   */
  getYesterday(): number {
    return Number(this.params[4] || DEFAULT_NUMBER);
  }

  /**
   * 获取涨跌
   */
  getPercent(): number {
    return this.getNow() ? this.getNow() / this.getYesterday() - 1 : 0;
  }

  /**
   * 获取股票数据
   */
  getStock(): Stock {
    const code = this.getCode();
    // 基金的格式和股票不一样
    if (code.indexOf(COMMON_FUND) !== -1) {
      // https://qt.gtimg.cn/q=jj100032
      // '100032~富国中证红利指数增强A~0.9810~0.0000~2022-04-28 15:00:00~0.9950~2.9940~1.4271~2022-04-28~'
      return {
        code,
        name: this.getName(),
        percent: Number(this.params[7] || DEFAULT_NUMBER),
        now: Number(this.params[5] || DEFAULT_NUMBER),
        low: DEFAULT_NUMBER,
        high: DEFAULT_NUMBER,
        yesterday: Number(this.params[2] || DEFAULT_NUMBER),
        updateDate: this.params[8],
      };
    }
    // https://qt.gtimg.cn/q=sh600031
    // https://qt.gtimg.cn/q=usBABA
    // https://qt.gtimg.cn/q=hk00700
    // 每个市场返回的数据还都不一样
    // "200~阿里巴巴~BABA.N~94.64~101.41~97.94~18673098~339605781918.5~356995447115.5~94.50~1~0~0~0~0~0~0~0~0~94.60~2~0~0~0~0~0~0~0~0~~2022-05-05 16:01:20~-6.77~-6.68~98.47~94.05~USD~18673098~1782307903~0.69~25.13~~11.34~1:8~4.36~1786.51928~2543.45000~Alibaba Group Holding Ltd~3.77~230.89~73.28~-1~1.73~~2543.45000~-20.33~4.10~GP~6.87~3.86~10.06~-12.11~-22.36~2687500000~1887700000~0.77~17.40~~95.45~"
    // "100~腾讯控股~00700~349.200~366.400~352.600~22923262.0~0~0~349.200~0~0~0~0~0~0~0~0~0~349.200~0~0~0~0~0~0~0~0~0~22923262.0~2022/05/06 16:09:10~-17.200~-4.69~355.400~347.000~349.200~22923262.0~8047736871.520~0~12.21~~0~0~2.29~33565.0565~33565.0565~TENCENT~0.46~626.600~297.000~0.88~55.03~0~0~0~0~0~12.21~3.40~0.24~100~-21.24~2.77~GP~27.88~14.13~0.34~-10.46~-26.95~9611986394.00~9611986394.00~12.21~1.60~351.073~-25.80";
    // '1~三一重工~600031~16.21~16.60~16.25~676837~324829~352008~16.21~1618~16.20~6367~16.19~1239~16.18~1221~16.17~644~16.22~3340~16.23~444~16.24~199~16.25~674~16.26~374~~20220506160001~-0.39~-2.35~16.61~16.05~16.21/676837/1104295457~676837~110430~0.80~17.03~~16.61~16.05~3.37~1376.76~1376.76~2.11~18.26~14.94~0.56~6058~16.32~21.65~11.44~~~1.58~110429.5457~0.0000~0~ ~GP-A~-28.90~10.95~3.67~12.39~5.71~33.07~14.58~-8.31~-7.64~-19.51~8493286250~8493286250~37.58~-43.64~8493286250~'
    let updateDate = "";
    if (code.indexOf(COMMON_US) !== -1) {
      updateDate = this.params[30].split(" ")[0];
    } else if (code.indexOf(COMMON_HK) !== -1) {
      updateDate = this.params[30].split(" ")[0].replace("/", "-");
    } else {
      updateDate = `${this.params[30].slice(0, 4)}-${this.params[30].slice(
        4,
        6
      )}-${this.params[30].slice(6, 8)}`;
    }
    return {
      code,
      name: this.getName(),
      percent: this.getPercent(),

      now: this.getNow(),
      low: this.getLow(),
      high: this.getHigh(),
      yesterday: this.getYesterday(),
      updateDate,
    };
  }
}

export default TencentStockTransform;
