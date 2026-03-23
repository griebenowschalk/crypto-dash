import { useQuery } from '@tanstack/react-query';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { Currency } from '@/types/crypto';
import { useAppCurrency } from '@/hooks/useAppCurrency';

export function useTopCoins(limit: number = 10, currencyOverride?: Currency) {
  const { currency: appCurrency } = useAppCurrency();
  const currency = currencyOverride ?? appCurrency;

  return useQuery({
    queryKey: ['topCoins', limit, currency],
    queryFn: () => cryptoCompareAPI.getTopCoins(limit, currency),
    staleTime: 60000,
  });
}
