import { useQuery } from '@tanstack/react-query';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { Currency, TimeFrame } from '@/types/crypto';

export function useHistoricalData(
  coin: string,
  currency: Currency = 'ZAR',
  timeframe: TimeFrame = 'day',
  limit: number = 30
) {
  return useQuery({
    queryKey: ['historical', coin, currency, timeframe, limit],
    queryFn: () =>
      cryptoCompareAPI.getHistoricalData(coin, currency, timeframe, limit),
    staleTime: timeframe === 'minute' ? 60000 : 300000,
  });
}
