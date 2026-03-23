import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { PriceChart } from '@/components/crypto/PriceChart';
import { Card, CardContent } from '@/components/ui/card';
import { H3, Large, Muted, P } from '@/components/typography';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { cn, formatCompact, formatPercentage, formatPrice } from '@/lib/utils';
import type { CoinPrice, PriceRaw } from '@/types/crypto';

function isCoinPrice(price: CoinPrice | PriceRaw): price is CoinPrice {
  return typeof (price as CoinPrice).price === 'number';
}

export function CoinDetail() {
  const { symbol } = useParams({ from: '/coin/$symbol' });
  const { data: price } = useCryptoPrice(symbol);
  const { isFavourite, toggleFavourite } = useFavouriteCoins();

  if (!price) {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <H3 className="scroll-m-0 font-bold">{symbol}</H3>
          <button
            type="button"
            onClick={() => toggleFavourite(symbol)}
            className="text-muted-foreground ml-auto transition-colors hover:text-yellow-400"
            aria-label={`Toggle ${symbol} favourite`}
          >
            <Star
              className={`h-5 w-5 ${isFavourite(symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`}
            />
          </button>
        </div>
        <PriceChart symbol={symbol} />
      </div>
    );
  }

  const priceValue = isCoinPrice(price) ? price.price : (price.PRICE ?? null);
  const changePct = isCoinPrice(price)
    ? price.changePct24h
    : (price.CHANGEPCT24HOUR ?? 0);
  const positive = changePct >= 0;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <H3 className="scroll-m-0 font-bold">{symbol}</H3>
        <button
          type="button"
          onClick={() => toggleFavourite(symbol)}
          className="text-muted-foreground ml-auto transition-colors hover:text-yellow-400"
          aria-label={`Toggle ${symbol} favourite`}
        >
          <Star
            className={`h-5 w-5 ${isFavourite(symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`}
          />
        </button>
      </div>

      {priceValue != null && (
        <div className="flex items-baseline gap-3">
          <Large className="text-4xl font-bold tracking-tight">
            {formatPrice(priceValue)}
          </Large>
          <P
            className={cn(
              'mt-0 text-lg font-medium',
              positive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {formatPercentage(changePct)} (24h)
          </P>
        </div>
      )}

      <PriceChart symbol={symbol} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="24h High"
          value={formatPrice(
            isCoinPrice(price)
              ? price.high24h
              : ((price as PriceRaw).HIGH24HOUR ?? 0)
          )}
        />
        <StatCard
          label="24h Low"
          value={formatPrice(
            isCoinPrice(price)
              ? price.low24h
              : ((price as PriceRaw).LOW24HOUR ?? 0)
          )}
        />
        <StatCard
          label="24h Volume"
          value={formatCompact(
            isCoinPrice(price)
              ? price.volume24h
              : ((price as PriceRaw).VOLUME24HOURTO ?? 0)
          )}
        />
        <StatCard
          label="24h Change"
          value={formatPercentage(
            isCoinPrice(price)
              ? price.change24h
              : ((price as PriceRaw).CHANGE24HOUR ?? 0)
          )}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-card/70">
      <CardContent className="p-4">
        <Muted className="mt-0 text-xs">{label}</Muted>
        <Large className="mt-1 text-base font-semibold">{value}</Large>
      </CardContent>
    </Card>
  );
}
