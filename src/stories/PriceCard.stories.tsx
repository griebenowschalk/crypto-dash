import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PriceCard } from '@/components/crypto/PriceCard';
import type { CoinInfo } from '@/types/crypto';

const meta: Meta<typeof PriceCard> = {
  title: 'Crypto/PriceCard',
  component: PriceCard,
  tags: ['autodocs'],
  decorators: [
    Story => {
      // QueryClient that never resolves fetches — shows the skeleton/loading state
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      });
      return (
        <QueryClientProvider client={client}>
          <div className="w-52">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PriceCard>;

const btc: CoinInfo = {
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  imageUrl: 'https://www.cryptocompare.com/media/37746251/btc.png',
};

const eth: CoinInfo = {
  id: 'ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  imageUrl: 'https://www.cryptocompare.com/media/37746238/eth.png',
};

export const Default: Story = {
  args: { coin: btc },
};

export const WithFeatureButton: Story = {
  args: {
    coin: btc,
    onFeature: (symbol: string) => console.log('featured', symbol),
    isFeatured: false,
  },
};

export const Featured: Story = {
  args: {
    coin: eth,
    onFeature: (symbol: string) => console.log('featured', symbol),
    isFeatured: true,
  },
};

export const MultipleCards: StoryObj = {
  decorators: [
    _StoryFn => {
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      });
      const coins: CoinInfo[] = [
        btc,
        eth,
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          imageUrl: 'https://www.cryptocompare.com/media/37747734/sol.png',
        },
      ];
      return (
        <QueryClientProvider client={client}>
          <div className="grid w-[800px] grid-cols-3 gap-4">
            {coins.map(coin => (
              <PriceCard key={coin.id} coin={coin} />
            ))}
          </div>
        </QueryClientProvider>
      );
    },
  ],
  render: () => <></>,
};
