import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { PriceCard } from '@/components/crypto/PriceCard';
import { PriceChart } from '@/components/crypto/PriceChart';
import { Loader } from '@/components/layout/Loader';
import { useTopCoins } from '@/hooks/useTopCoins';
import { ThemeToggle } from '@/components/theme-toggle';
import { H1, P } from '@/components/typography';

export function Dashboard() {
  const { favourites, currentFavourite, setCurrentFavourite } =
    useFavouriteCoins();
  const { data: topCoins, isLoading } = useTopCoins();
  const favouriteCoins = (topCoins ?? []).filter(c =>
    favourites.includes(c.symbol)
  );
  const topCoinsList = (topCoins ?? []).slice(0, 8);

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
          Your Favourites ({favourites.length})
        </h2>
        {favouriteCoins.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favouriteCoins.map(coin => (
              <PriceCard
                key={`fav-${coin.symbol}`}
                coin={coin}
                onFeature={setCurrentFavourite}
                isFeatured={coin.symbol === currentFavourite}
              />
            ))}
          </div>
        ) : (
          <P className="text-muted-foreground text-sm">
            Star a coin in Top Coins to add it here.
          </P>
        )}
      </section>

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
          Top Coins
        </h2>
        <div className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {topCoinsList.map(coin => (
            <PriceCard key={coin.symbol} coin={coin} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
          {currentFavourite ? `${currentFavourite} Chart` : 'Chart'}
        </h2>
        {currentFavourite ? (
          <PriceChart symbol={currentFavourite} />
        ) : (
          <P className="text-muted-foreground text-sm">
            Select a favourite to show its chart.
          </P>
        )}
      </section>
    </div>
  );
}
