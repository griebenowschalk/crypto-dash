import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { cryptoCompareWebSocket } from '@/lib/cryptocompare-websocket';
import { CoinPrice, Currency } from '@/types/crypto';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useCryptoPrice(coin: string, currency: Currency = 'ZAR') {
  const [livePrice, setLivePrice] = useState<CoinPrice | null>(null);
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
        setLivePrice({
          price: initialPrice.PRICE ?? 0,
          change24h: initialPrice.CHANGE24HOUR ?? 0,
          changePct24h: initialPrice.CHANGEPCT24HOUR ?? 0,
          high24h: initialPrice.HIGH24HOUR ?? 0,
          low24h: initialPrice.LOW24HOUR ?? 0,
          volume24h: initialPrice.VOLUME24HOURTO ?? 0,
          lastUpdate: initialPrice.LASTUPDATE ?? 0,
          open24h: initialPrice.OPEN24HOUR,
          marketCap: initialPrice.MKTCAP ?? 0,
        } as CoinPrice);
      });
    }

    //Subscribe to WebSocket price updates
    const unsubscribe = cryptoCompareWebSocket.subscribe(
      [coin],
      currency,
      data => {
        setLivePrice(prev => {
          if (!prev) return null;
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
          } as CoinPrice;
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
