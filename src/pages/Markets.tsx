import { Link } from '@tanstack/react-router';
import { Search, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useCoinSearch } from '@/hooks/useCoinSearch';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { useTopCoins } from '@/hooks/useTopCoins';
import { H3, Muted, Small } from '@/components/typography';
import { formatCompact, formatPercentage, formatPrice } from '@/lib/utils';
import type { CoinInfo, CoinPrice, PriceRaw } from '@/types/crypto';

function isCoinPrice(price: CoinPrice | PriceRaw): price is CoinPrice {
  return typeof (price as CoinPrice).price === 'number';
}

export function Markets() {
  const { query, setQuery, results } = useCoinSearch(200);
  const { data: topCoins = [], isLoading } = useTopCoins(50);
  const { favourites, isFavourite, toggleFavourite } = useFavouriteCoins();
  const visibleCoins = query.trim() ? results.slice(0, 40) : topCoins;

  return (
    <div className="space-y-4 py-6">
      <div>
        <H3 className="scroll-m-0 border-0 pb-0">Markets</H3>
        <Muted className="mt-2 [&:not(:first-child)]:mt-2">
          Browse coins and quickly add favourites.
        </Muted>
      </div>

      <div className="relative max-w-xl">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search symbols or names..."
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border py-2 pr-4 pl-9 text-sm outline-none focus-visible:ring-1"
        />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr className="text-left tracking-wide uppercase">
              <th className="p-3">
                <Small className="text-muted-foreground">Coin</Small>
              </th>
              <th className="p-3 text-right">
                <Small className="text-muted-foreground">Price</Small>
              </th>
              <th className="p-3 text-right">
                <Small className="text-muted-foreground">24h</Small>
              </th>
              <th className="hidden p-3 text-right md:table-cell">
                <Small className="text-muted-foreground">Volume</Small>
              </th>
              <th className="p-3 text-right">
                <Small className="text-muted-foreground">Fav</Small>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  <Muted className="mt-0">Loading markets...</Muted>
                </td>
              </tr>
            ) : visibleCoins.length > 0 ? (
              visibleCoins.map(coin => (
                <MarketRow
                  key={coin.id}
                  coin={coin}
                  favourite={isFavourite(coin.symbol)}
                  onToggleFavourite={() => toggleFavourite(coin.symbol)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  <Muted className="mt-0">No matching coins.</Muted>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Small className="text-muted-foreground">
        Tracking {favourites.length} favourites.
      </Small>
    </div>
  );
}

function MarketRow({
  coin,
  favourite,
  onToggleFavourite,
}: {
  coin: CoinInfo;
  favourite: boolean;
  onToggleFavourite: () => void;
}) {
  const { data: price } = useCryptoPrice(coin.symbol);
  const priceValue = price
    ? isCoinPrice(price)
      ? price.price
      : (price.PRICE ?? null)
    : null;
  const changePct = price
    ? isCoinPrice(price)
      ? price.changePct24h
      : (price.CHANGEPCT24HOUR ?? 0)
    : 0;
  const volume = price
    ? isCoinPrice(price)
      ? price.volume24h
      : (price.VOLUME24HOURTO ?? 0)
    : 0;
  const positive = changePct >= 0;

  return (
    <tr className="border-t text-sm">
      <td className="p-3">
        <Link
          to="/coin/$symbol"
          params={{ symbol: coin.symbol }}
          className="flex items-center gap-2 hover:underline"
        >
          <img
            src={coin.imageUrl}
            alt={coin.name}
            className="h-7 w-7 rounded-full"
            loading="lazy"
          />
          <span className="font-medium">{coin.symbol}</span>
          <span className="text-muted-foreground hidden md:inline">
            {coin.name}
          </span>
        </Link>
      </td>
      <td className="p-3 text-right font-mono">
        {priceValue != null ? formatPrice(priceValue) : '—'}
      </td>
      <td
        className={`p-3 text-right ${positive ? 'text-green-500' : 'text-red-500'}`}
      >
        <span className="inline-flex items-center gap-1">
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {priceValue != null ? formatPercentage(changePct) : '—'}
        </span>
      </td>
      <td className="hidden p-3 text-right font-mono md:table-cell">
        {priceValue != null ? formatCompact(volume) : '—'}
      </td>
      <td className="p-3 text-right">
        <button
          type="button"
          onClick={onToggleFavourite}
          className="text-muted-foreground transition-colors hover:text-yellow-400"
          aria-label={`Toggle ${coin.symbol} favourite`}
        >
          <Star
            className={`h-4 w-4 ${favourite ? 'fill-yellow-400 text-yellow-400' : ''}`}
          />
        </button>
      </td>
    </tr>
  );
}
