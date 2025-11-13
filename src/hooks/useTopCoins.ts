import { useQuery } from '@tanstack/react-query';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { Currency } from '@/types/crypto';

export function useTopCoins(limit: number = 10, currency: Currency = 'ZAR') {
  return useQuery({
    queryKey: ['topCoins', limit, currency],
    queryFn: () => cryptoCompareAPI.getTopCoins(limit, currency),
    staleTime: 60000,
  });
}
