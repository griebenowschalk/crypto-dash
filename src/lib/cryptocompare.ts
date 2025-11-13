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
  CoinPrice,
  type CoinListResponse,
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
        imageUrl: `https://www.cryptocompare.com${coin.ImageUrl}`,
      }));
  }

  async getMultiplePrices(
    symbols: string[],
    currency: Currency
  ): Promise<Record<string, CoinPrice>> {
    const data = await this.fetchData<CoinPriceResponse>('/pricemultifull', {
      fsyms: symbols.join(','),
      tsyms: currency,
    });
    return data.Data;
  }

  async getPrice(symbol: string, currency: Currency): Promise<CoinPrice> {
    const data = await this.fetchData<CoinPriceResponse>('/pricemultifull', {
      fsym: symbol,
      tsyms: currency,
    });
    return data.Data[symbol];
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
    const data = await this.fetchData<HistoricalDataPoint[]>(endpoint, {
      fsym: symbol,
      tsym: currency,
      limit: limit.toString(),
    });
    return data;
  }

  async getTopCoins(
    limit: number = 10,
    currency: Currency
  ): Promise<CoinInfo[]> {
    const data = await this.fetchData<CoinListResponse>('/all/coinlist', {
      limit: limit.toString(),
      tsym: currency,
    });
    return Object.values(data.Data).map(coin => ({
      id: coin.Id,
      symbol: coin.Symbol,
      name: coin.CoinName,
      imageUrl: `https://www.cryptocompare.com${coin.ImageUrl}`,
    }));
  }
}

export const cryptoCompareAPI = new CryptoCompareAPI(API_KEY!);
