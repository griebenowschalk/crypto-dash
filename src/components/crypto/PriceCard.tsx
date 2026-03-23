import { Link } from '@tanstack/react-router';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkline } from './Sparkline';
import { formatPrice, formatPercentage } from '@/lib/utils';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { useAppCurrency } from '@/hooks/useAppCurrency';
import type { CoinInfo, CoinPrice, PriceRaw } from '@/types/crypto';

interface PriceCardProps {
  coin: CoinInfo;
  onFeature?: (symbol: string) => void;
  isFeatured?: boolean;
}

export function PriceCard({
  coin,
  onFeature,
  isFeatured = false,
}: PriceCardProps) {
  const { currency } = useAppCurrency();
  const { data: price } = useCryptoPrice(coin.symbol);
  const { data: history } = useHistoricalData(coin.symbol, currency, 'day');
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
      <Card className="group hover:border-border/80 hover:bg-card bg-card/70 h-full cursor-pointer border transition-all duration-200 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <img
                loading="lazy"
                src={coin.imageUrl}
                alt={coin.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="min-h-9 min-w-0">
                <p className="truncate font-semibold">{coin.symbol}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {coin.name}
                </p>
              </div>
            </div>
            <button
              onClick={e => {
                e.preventDefault();
                toggleFavourite(coin.symbol);
              }}
              className="text-muted-foreground hover:bg-muted rounded-md p-1.5 transition-colors hover:text-yellow-400"
              aria-label={`Toggle ${coin.symbol} favourite`}
            >
              <Star
                className={`h-4 w-4 ${isFavourite(coin.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            </button>
          </div>

          <div className="mb-3">
            <p className="text-xl font-bold tracking-tight">
              {priceValue !== null ? formatPrice(priceValue, currency) : '—'}
            </p>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}
            >
              {positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {priceValue !== null ? formatPercentage(pctValue) : '—'}
            </div>
            {onFeature && (
              <button
                onClick={e => {
                  e.preventDefault();
                  onFeature(coin.symbol);
                }}
                className={`mt-2 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                  isFeatured
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                aria-label={`Feature ${coin.symbol} chart`}
              >
                {isFeatured ? 'Featured' : 'Feature'}
              </button>
            )}
          </div>

          {history && (
            <div className="mt-auto border-t pt-3">
              <Sparkline data={history} positive={positive} />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
