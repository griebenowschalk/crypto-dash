import { useQuery } from '@tanstack/react-query';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { Currency, TimeFrame } from '@/types/crypto';
import { useAppCurrency } from '@/hooks/useAppCurrency';

export function useHistoricalData(
  coin: string,
  currencyOverride?: Currency,
  timeframe: TimeFrame = 'day',
  limit: number = 30
) {
  const { currency: appCurrency } = useAppCurrency();
  const currency = currencyOverride ?? appCurrency;

  return useQuery({
    queryKey: ['historical', coin, currency, timeframe, limit],
    queryFn: () =>
      cryptoCompareAPI.getHistoricalData(coin, currency, timeframe, limit),
    staleTime: timeframe === 'minute' ? 60000 : 300000,
  });
}
