import { Link } from '@tanstack/react-router';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkline } from './Sparkline';
import { formatPrice, formatPercentage } from '@/lib/utils';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import type { CoinInfo, CoinPrice, PriceRaw } from '@/types/crypto';

interface PriceCardProps {
  coin: CoinInfo;
}

export function PriceCard({ coin }: PriceCardProps) {
  const { data: price } = useCryptoPrice(coin.symbol);
  const { data: history } = useHistoricalData(coin.symbol, undefined, 'hour');
  const { isFavourite, toggleFavourite } = useFavouriteCoins();

  function isCoinPrice(p: CoinPrice | PriceRaw): p is CoinPrice {
    return typeof (p as CoinPrice).price === 'number';
  }

  const priceValue = price
    ? isCoinPrice(price)
      ? price.price
      : (price.PRICE ?? null)
    : null;

  const pctValue = price
    ? isCoinPrice(price)
      ? price.changePct24h
      : (price.CHANGEPCT24HOUR ?? 0)
    : 0;

  const positive = pctValue >= 0;

  return (
    <Link to="/coin/$symbol" params={{ symbol: coin.symbol }}>
      <Card className="hover:border-border/80 cursor-pointer transition-colors">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <img
                loading="lazy"
                src={`https://www.cryptocompare.com${coin.imageUrl}`}
                alt={coin.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="font-semibold">{coin.symbol}</p>
                <p className="text-muted-foreground text-xs">{coin.name}</p>
              </div>
            </div>
            <button
              onClick={e => {
                e.preventDefault();
                toggleFavourite(coin.symbol);
              }}
              className="text-muted-foreground transition-colors hover:text-yellow-400"
            >
              <Star
                className={`h-4 w-4 ${isFavourite(coin.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            </button>
          </div>

          <div className="mb-2">
            <p className="text-lg font-bold">
              {priceValue !== null ? formatPrice(priceValue) : '—'}
            </p>
            <div
              className={`flex items-center gap-1 text-xs ${positive ? 'text-green-500' : 'text-red-500'}`}
            >
              {positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {priceValue !== null ? formatPercentage(pctValue) : '—'}
            </div>
          </div>

          {history && <Sparkline data={history} positive={positive} />}
        </CardContent>
      </Card>
    </Link>
  );
}
