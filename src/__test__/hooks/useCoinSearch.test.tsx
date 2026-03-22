import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCoinSearch } from '@/hooks/useCoinSearch';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { createQueryClientWrapper } from '@/__test__/test-utils';

vi.mock('@/lib/cryptocompare', () => ({
  cryptoCompareAPI: {
    getAllCoins: vi.fn(),
  },
}));

const mockCoins = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', imageUrl: '' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', imageUrl: '' },
  { id: '3', symbol: 'DOGE', name: 'Dogecoin', imageUrl: '' },
];

describe('useCoinSearch', () => {
  beforeEach(() => {
    vi.mocked(cryptoCompareAPI.getAllCoins).mockResolvedValue(mockCoins);
  });

  it('returns filtered results after debounce', async () => {
    const { Wrapper } = createQueryClientWrapper();

    const { result } = renderHook(() => useCoinSearch(0), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setQuery('bit');
    });

    await waitFor(() => {
      expect(result.current.results.map(c => c.symbol)).toEqual(['BTC']);
    });
  });

  it('sorts exact symbol match first', async () => {
    const { Wrapper } = createQueryClientWrapper();
    const extended = [
      ...mockCoins,
      { id: '4', symbol: 'BIT', name: 'Bit something', imageUrl: '' },
    ];
    vi.mocked(cryptoCompareAPI.getAllCoins).mockResolvedValue(extended);

    const { result } = renderHook(() => useCoinSearch(0), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setQuery('bit');
    });

    await waitFor(() => {
      expect(result.current.results[0]?.symbol).toBe('BIT');
    });
  });
});
