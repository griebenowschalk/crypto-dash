import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';
import { PriceCard } from '@/components/crypto/PriceCard';
import { PriceChart } from '@/components/crypto/PriceChart';
import { Loader } from '@/components/layout/Loader';
import { useTopCoins } from '@/hooks/useTopCoins';
import { H1, P, SectionLabel } from '@/components/typography';

export function Dashboard() {
  const { favourites, currentFavourite, setCurrentFavourite } =
    useFavouriteCoins();
  const { data: topCoins, isLoading } = useTopCoins();
  const favouriteCoins = (topCoins ?? []).filter(c =>
    favourites.includes(c.symbol)
  );
  const topCoinsList = (topCoins ?? []).slice(0, 8);
  const hasFavourites = favourites.length > 0;
  const heading = hasFavourites ? 'Your Favourites' : 'Top Coins';
  const displayCoins = hasFavourites ? favouriteCoins : topCoinsList;

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 py-6">
      <div>
        <H1>Dashboard</H1>
        <P>Track favourites and pick a coin to feature in the chart.</P>
      </div>

      <section>
        <SectionLabel>
          {heading} ({displayCoins.length})
        </SectionLabel>
        {displayCoins.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {displayCoins.map(coin => (
              <PriceCard
                key={coin.symbol}
                coin={coin}
                onFeature={setCurrentFavourite}
                isFeatured={coin.symbol === currentFavourite}
              />
            ))}
          </div>
        ) : (
          <P className="text-muted-foreground mt-0 text-sm">
            Add favourites in Settings to pin your preferred coins.
          </P>
        )}
      </section>

      <section>
        <SectionLabel>
          {currentFavourite ? `${currentFavourite} Chart` : 'Chart'}
        </SectionLabel>
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
