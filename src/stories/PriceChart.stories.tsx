import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PriceChart } from '@/components/crypto/PriceChart';

const meta: Meta<typeof PriceChart> = {
  title: 'Crypto/PriceChart',
  component: PriceChart,
  tags: ['autodocs'],
  decorators: [
    Story => {
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      });
      return (
        <QueryClientProvider client={client}>
          <div className="w-full max-w-2xl">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PriceChart>;

export const Bitcoin: Story = {
  args: { symbol: 'BTC' },
};

export const Ethereum: Story = {
  args: { symbol: 'ETH' },
};
