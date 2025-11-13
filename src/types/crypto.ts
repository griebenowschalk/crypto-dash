export interface CoinPrice {
  price: number;
  change24h: number;
  changePct24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdate: number;
  open24h: number;
  marketCap?: number;
}

export interface HistoricalDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumefrom: number;
  volumeto: number;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  imageUrl: string;
}

export type TimeFrame = 'minute' | 'hour' | 'day';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH' | 'ZAR';

export interface FavoriteCoinsState {
  favorites: string[];
  currentFavorite: string;
}

export interface CoinPriceResponse {
  Response: string;
  Message: string;
  Data: Record<string, CoinPrice>;
}

export interface CoinListResponse {
  Response: string;
  Message: string;
  Data: Record<
    string,
    {
      Id: string;
      Symbol: string;
      CoinName: string;
      ImageUrl: string;
    }
  >;
}

export interface WebSocketPriceUpdate {
  TYPE: string;
  FROMSYMBOL: string;
  TOSYMBOL: string;
  PRICE?: number;
  CHANGE24HOUR?: number;
  CHANGEPCT24HOUR?: number;
  HIGH24HOUR?: number;
  LOW24HOUR?: number;
  VOLUME24HOURTO?: number;
  LASTUPDATE?: number;
  OPEN24HOUR?: number;
}
