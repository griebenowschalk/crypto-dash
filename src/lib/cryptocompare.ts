/**
 * CryptoCompare API client
 *
 * API
 * GET /all/coinlist
 * https://developers.coindesk.com/documentation/legacy/Other/allCoinsWithContentEndpoint
 *
 * Multiple symbols full price:
 * GET /pricemultifull
 * https://developers.coindesk.com/documentation/legacy/Price/multipleSymbolsFullPriceEndpoint
 **/

import {
  CoinInfo,
  PriceRaw,
  type CoinListResponse,
  type TopCoinsResponse,
  Currency,
  CoinPriceResponse,
  HistoricalDataPoint,
  TimeFrame,
} from '@/types/crypto';

const API_KEY = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
const BASE_URL = 'https://min-api.cryptocompare.com/data';

class CryptoCompareAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private normalizeImageUrl(imageUrl?: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://www.cryptocompare.com${imageUrl}`;
  }

  private extractRawPrice(
    data: CoinPriceResponse,
    symbol: string,
    currency: Currency
  ): PriceRaw {
    const raw = data.RAW?.[symbol]?.[currency];
    if (raw) {
      return raw;
    }

    const direct = data.Data?.[symbol];
    if (direct && typeof direct === 'object' && 'PRICE' in direct) {
      return direct;
    }

    throw new Error(`No price payload for ${symbol}/${currency}`);
  }

  private async fetchData<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const queryParams = new URLSearchParams({
      ...params,
      api_key: this.apiKey,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.Response === 'Error') {
        throw new Error(data.Message || 'Unknown API error');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Fetch all coins once. Cache this with React Query (staleTime: 1 hour).
   * Use this with client-side fuzzy search for live debounced search.
   */
  async getAllCoins(): Promise<CoinInfo[]> {
    const coinList = await this.fetchData<CoinListResponse>('/all/coinlist');
    const coins = Object.values(coinList.Data);

    return coins
      .filter(coin => coin.Symbol && coin.CoinName) // Filter out invalid entries
      .map(coin => ({
        id: coin.Id,
        symbol: coin.Symbol,
        name: coin.CoinName,
        imageUrl: this.normalizeImageUrl(coin.ImageUrl),
      }));
  }

  async getMultiplePrices(
    symbols: string[],
    currency: Currency
  ): Promise<Record<string, PriceRaw>> {
    const data = await this.fetchData<CoinPriceResponse>('/pricemultifull', {
      fsyms: symbols.join(','),
      tsyms: currency,
    });
    return symbols.reduce<Record<string, PriceRaw>>((acc, symbol) => {
      try {
        acc[symbol] = this.extractRawPrice(data, symbol, currency);
      } catch {
        // Skip symbols that are not present in payload.
      }
      return acc;
    }, {});
  }

  async getPrice(symbol: string, currency: Currency): Promise<PriceRaw> {
    const data = await this.fetchData<CoinPriceResponse>('/pricemultifull', {
      fsyms: symbol,
      tsyms: currency,
    });
    return this.extractRawPrice(data, symbol, currency);
  }

  async getHistoricalData(
    symbol: string,
    currency: Currency,
    timeframe: TimeFrame,
    limit: number = 30
  ): Promise<HistoricalDataPoint[]> {
    const endpoints = {
      minute: '/v2/histominute',
      hour: '/v2/histohour',
      day: '/v2/histoday',
    };
    const endpoint = endpoints[timeframe];
    const data = await this.fetchData<{
      Data?: { Data?: HistoricalDataPoint[] };
    }>(endpoint, {
      fsym: symbol,
      tsym: currency,
      limit: limit.toString(),
    });
    return Array.isArray(data.Data?.Data) ? data.Data!.Data! : [];
  }

  async getTopCoins(
    limit: number = 10,
    currency: Currency
  ): Promise<CoinInfo[]> {
    const data = await this.fetchData<TopCoinsResponse>('/top/mktcapfull', {
      limit: limit.toString(),
      tsym: currency,
    });
    return data.Data.map(item => ({
      id: item.CoinInfo.Id,
      symbol: item.CoinInfo.Name,
      name: item.CoinInfo.FullName,
      imageUrl: this.normalizeImageUrl(item.CoinInfo.ImageUrl),
    }));
  }
}

export const cryptoCompareAPI = new CryptoCompareAPI(API_KEY!);
