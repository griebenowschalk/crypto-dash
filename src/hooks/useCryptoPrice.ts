import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { cryptoCompareWebSocket } from '@/lib/cryptocompare-websocket';
import { CoinPrice, Currency, PriceRaw } from '@/types/crypto';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAppCurrency } from '@/hooks/useAppCurrency';

export function useCryptoPrice(coin: string, currencyOverride?: Currency) {
  const { currency: appCurrency } = useAppCurrency();
  const currency = currencyOverride ?? appCurrency;
  const [livePrice, setLivePrice] = useState<CoinPrice | null>(null);

  const toCoinPrice = (raw: PriceRaw): CoinPrice => ({
    price: raw.PRICE ?? 0,
    change24h: raw.CHANGE24HOUR ?? 0,
    changePct24h: raw.CHANGEPCT24HOUR ?? 0,
    high24h: raw.HIGH24HOUR ?? 0,
    low24h: raw.LOW24HOUR ?? 0,
    volume24h: raw.VOLUME24HOURTO ?? 0,
    lastUpdate: raw.LASTUPDATE ?? 0,
    open24h: raw.OPEN24HOUR ?? 0,
    marketCap: raw.MKTCAP ?? 0,
  });

  const {
    data: initialPrice,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coinPrice', coin, currency],
    queryFn: () => cryptoCompareAPI.getPrice(coin, currency),
    staleTime: 30000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (initialPrice) {
      Promise.resolve().then(() => {
        setLivePrice(toCoinPrice(initialPrice));
      });
    }

    //Subscribe to WebSocket price updates
    const unsubscribe = cryptoCompareWebSocket.subscribe(
      [coin],
      currency,
      data => {
        setLivePrice(prev => {
          // If REST seed failed/missing, bootstrap from first websocket tick.
          if (!prev) return toCoinPrice(data);
          return {
            ...prev,
            price: data.PRICE ?? prev.price,
            change24h: data.CHANGE24HOUR ?? prev.change24h,
            changePct24h: data.CHANGEPCT24HOUR ?? prev.changePct24h,
            high24h: data.HIGH24HOUR ?? prev.high24h,
            low24h: data.LOW24HOUR ?? prev.low24h,
            volume24h: data.VOLUME24HOURTO ?? prev.volume24h,
            lastUpdate: data.LASTUPDATE ?? prev.lastUpdate,
            open24h: data.OPEN24HOUR ?? prev.open24h,
            marketCap: data.MKTCAP ?? prev.marketCap,
          };
        });
      }
    );

    return () => unsubscribe();
  }, [coin, currency, initialPrice]);

  return {
    data: livePrice || initialPrice,
    isLoading,
    error,
  };
}
