export interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export type TradingPair = 'BTC/USDT' | 'ETH/USDT';
