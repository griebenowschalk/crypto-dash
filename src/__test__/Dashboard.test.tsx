import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '@/pages/Dashboard';
import { createQueryClientWrapper } from '@/__test__/test-utils';

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

vi.mock('@/hooks/useTopCoins', () => ({
  useTopCoins: () => ({
    data: [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', imageUrl: '' },
      { id: '2', symbol: 'ETH', name: 'Ethereum', imageUrl: '' },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useCryptoPrice', () => ({
  useCryptoPrice: () => ({
    data: {
      price: 50_000,
      changePct24h: 1,
      change24h: 0,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
      lastUpdate: 0,
      open24h: 0,
    },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useHistoricalData', () => ({
  useHistoricalData: () => ({ data: [], isLoading: false }),
}));

describe('Dashboard', () => {
  it('renders welcome copy and top coins section', async () => {
    const { Wrapper } = createQueryClientWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    expect(
      await screen.findByRole('heading', { name: /welcome to cryptodash/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Dashboard for following crypto prices.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /top coins/i })
    ).toBeInTheDocument();
  });

  it('renders price cards for top coins', async () => {
    const { Wrapper } = createQueryClientWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await screen.findByRole('heading', { name: /welcome to cryptodash/i });
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('renders chart section', async () => {
    const { Wrapper } = createQueryClientWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await screen.findByRole('heading', { name: /welcome to cryptodash/i });
    expect(screen.getByRole('heading', { name: /chart/i })).toBeInTheDocument();
  });
});
