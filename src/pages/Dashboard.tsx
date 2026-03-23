import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { PriceCard } from '@/components/crypto/PriceCard';
import { PriceChart } from '@/components/crypto/PriceChart';
import { Loader } from '@/components/layout/Loader';
import { useTopCoins } from '@/hooks/useTopCoins';
import { ThemeToggle } from '@/components/theme-toggle';
import { H1, P } from '@/components/typography';

export function Dashboard() {
  const { favourites, currentFavourite } = useFavouriteCoins();
  const { data: topCoins, isLoading } = useTopCoins();

  const displayCoins =
    favourites.length > 0
      ? (topCoins?.filter(c => favourites.includes(c.symbol)) ?? [])
      : (topCoins?.slice(0, 6) ?? []);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H1>Welcome to CryptoDash</H1>
          <P>Dashboard for following crypto prices.</P>
        </div>
        <ThemeToggle />
      </div>

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
          {favourites.length > 0 ? 'Your Favourites' : 'Top Coins'}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {displayCoins.map(coin => (
            <PriceCard key={coin.symbol} coin={coin} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
          {currentFavourite} Chart
        </h2>
        <PriceChart symbol={currentFavourite} />
      </section>
    </div>
  );
}
