import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      { id: '1', symbol: 'BTC', name: 'Bitcoin', imageUrl: '/btc.png' },
      { id: '2', symbol: 'ETH', name: 'Ethereum', imageUrl: '/eth.png' },
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

const setCurrentFavouriteMock = vi.fn();

vi.mock('@/hooks/useFavouriteCoins', () => ({
  useFavouriteCoins: () => ({
    favourites: ['BTC', 'ETH'],
    currentFavourite: 'BTC',
    setCurrentFavourite: setCurrentFavouriteMock,
    isFavourite: (coin: string) => ['BTC', 'ETH'].includes(coin),
    toggleFavourite: vi.fn(),
    addFavourite: vi.fn(),
    removeFavourite: vi.fn(),
    resetFavourites: vi.fn(),
    firstVisit: false,
    containsFavourite: vi.fn(),
  }),
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
    expect(screen.getAllByText('BTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ETH').length).toBeGreaterThan(0);
  });

  it('renders chart section', async () => {
    const { Wrapper } = createQueryClientWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await screen.findByRole('heading', { name: /welcome to cryptodash/i });
    expect(screen.getByRole('heading', { name: /chart/i })).toBeInTheDocument();
  });

  it('sets current favourite from Feature button', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createQueryClientWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await screen.findByRole('heading', { name: /your favourites/i });
    await user.click(screen.getByLabelText('Feature ETH chart'));

    expect(setCurrentFavouriteMock).toHaveBeenCalledWith('ETH');
  });
});
