import { Plus, Search, X } from 'lucide-react';
import { H1, H4, P } from '@/components/typography';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppCurrency } from '@/hooks/useAppCurrency';
import { useCoinSearch } from '@/hooks/useCoinSearch';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { MAX_FAVOURITES } from '@/lib/favourite-coins-store';
import type { Currency } from '@/types/crypto';

export function Settings() {
  const { currency, setCurrency, options } = useAppCurrency();
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavouriteCoins();
  const { query, setQuery, results, allCoins, isLoading } = useCoinSearch(200);

  const suggestions = query.trim() ? results : allCoins.slice(0, 20);
  const availableSuggestions = suggestions
    .filter(coin => !isFavourite(coin.symbol))
    .slice(0, 15);
  const reachedMax = favourites.length >= MAX_FAVOURITES;

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <H1>Settings</H1>
        <P>Configure global preferences for CryptoDash.</P>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <H4 className="scroll-m-0 border-0 pb-0 text-base leading-none font-semibold">
            Appearance
          </H4>
          <P className="text-muted-foreground mt-0 text-sm">
            Toggle between light and dark mode.
          </P>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card className="bg-card/70">
        <CardHeader>
          <H4 className="scroll-m-0 border-0 pb-0 text-base leading-none font-semibold">
            Display Currency
          </H4>
          <P className="text-muted-foreground mt-0 text-sm">
            Applies across dashboard, markets, and charts.
          </P>
        </CardHeader>
        <CardContent>
          <Select
            value={currency}
            onValueChange={value => setCurrency(value as Currency)}
          >
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="bg-card/70">
        <CardHeader>
          <H4 className="scroll-m-0 border-0 pb-0 text-base leading-none font-semibold">
            Favourite Coins
          </H4>
          <P className="text-muted-foreground mt-0 text-sm">
            Track up to {MAX_FAVOURITES} coins on your dashboard.
          </P>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {favourites.map(symbol => (
              <Badge key={symbol} variant="secondary" className="gap-1.5 py-1">
                <span>{symbol}</span>
                <button
                  type="button"
                  onClick={() => removeFavourite(symbol)}
                  className="text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                  aria-label={`Remove ${symbol} favourite`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {favourites.length === 0 && (
              <P className="text-muted-foreground mt-0 text-sm">
                No favourites yet.
              </P>
            )}
          </div>

          <div className="relative max-w-xl">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search to add coins..."
              className="border-input bg-background focus-visible:ring-ring w-full rounded-md border py-2 pr-4 pl-9 text-sm outline-none focus-visible:ring-1"
            />
          </div>

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {isLoading ? (
              <P className="text-muted-foreground mt-0 text-sm">
                Loading suggestions...
              </P>
            ) : availableSuggestions.length > 0 ? (
              availableSuggestions.map(coin => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => addFavourite(coin.symbol)}
                  disabled={reachedMax}
                  className="hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <img
                      src={coin.imageUrl}
                      alt={coin.name}
                      className="h-5 w-5 rounded-full"
                      loading="lazy"
                    />
                    <span className="font-medium">{coin.symbol}</span>
                    <span className="text-muted-foreground truncate">
                      {coin.name}
                    </span>
                  </span>
                  <Plus className="text-muted-foreground h-4 w-4 shrink-0" />
                </button>
              ))
            ) : (
              <P className="text-muted-foreground mt-0 text-sm">
                {query.trim()
                  ? 'No coins matched your search.'
                  : 'No more coins to add.'}
              </P>
            )}
          </div>

          {reachedMax && (
            <P className="text-muted-foreground mt-0 text-sm">
              You have reached the {MAX_FAVOURITES}-coin limit.
            </P>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
