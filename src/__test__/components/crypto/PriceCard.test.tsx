import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PriceCard } from '@/components/crypto/PriceCard';
import { createQueryClientWrapper } from '@/__test__/test-utils';
import { formatCompactPrice, formatPrice } from '@/lib/utils';
import type { CoinPrice } from '@/types/crypto';

let mockPrice: CoinPrice | null = null;

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to: _to,
    params: _params,
    ...rest
  }: {
    children: ReactNode;
    to?: string;
    params?: Record<string, string>;
  } & Record<string, unknown>) => (
    <a href="#" {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAppCurrency', () => ({
  useAppCurrency: () => ({ currency: 'ZAR' as const }),
}));

vi.mock('@/hooks/useCryptoPrice', () => ({
  useCryptoPrice: () => ({ data: mockPrice, isLoading: false }),
}));

vi.mock('@/hooks/useHistoricalData', () => ({
  useHistoricalData: () => ({ data: undefined, isLoading: false }),
}));

vi.mock('@/hooks/useFavouriteCoins', () => ({
  useFavouriteCoins: () => ({
    isFavourite: () => false,
    toggleFavourite: vi.fn(),
  }),
}));

const coin = {
  id: '1',
  symbol: 'BTC',
  name: 'Bitcoin',
  imageUrl: '/btc.png',
};

describe('PriceCard', () => {
  it('renders compact price formatting for very large values', () => {
    mockPrice = {
      price: 1_250_000,
      changePct24h: 1.25,
      change24h: 1000,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
      lastUpdate: 0,
      open24h: 0,
    };

    const { Wrapper } = createQueryClientWrapper();
    const { container } = render(<PriceCard coin={coin} />, {
      wrapper: Wrapper,
    });

    const priceEl = container.querySelector('.tracking-tight');
    expect(priceEl).toBeTruthy();
    expect((priceEl?.textContent ?? '').replace(/\s/g, '')).toBe(
      formatCompactPrice(1_250_000, 'ZAR').replace(/\s/g, '')
    );
  });

  it('renders standard price formatting for smaller values', () => {
    mockPrice = {
      price: 50_000,
      changePct24h: -0.5,
      change24h: -250,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
      lastUpdate: 0,
      open24h: 0,
    };

    const { Wrapper } = createQueryClientWrapper();
    const { container } = render(<PriceCard coin={coin} />, {
      wrapper: Wrapper,
    });

    const priceEl = container.querySelector('.tracking-tight');
    expect(priceEl).toBeTruthy();
    expect((priceEl?.textContent ?? '').replace(/\s/g, '')).toBe(
      formatPrice(50_000, 'ZAR').replace(/\s/g, '')
    );
  });
});
