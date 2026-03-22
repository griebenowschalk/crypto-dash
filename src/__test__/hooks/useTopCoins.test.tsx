import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTopCoins } from '@/hooks/useTopCoins';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { createQueryClientWrapper } from '@/__test__/test-utils';

vi.mock('@/lib/cryptocompare', () => ({
  cryptoCompareAPI: {
    getTopCoins: vi.fn(),
  },
}));

const top = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', imageUrl: '' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', imageUrl: '' },
];

describe('useTopCoins', () => {
  beforeEach(() => {
    vi.mocked(cryptoCompareAPI.getTopCoins).mockResolvedValue(top);
  });

  it('fetches top coins with limit and currency', async () => {
    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useTopCoins(5, 'USD'), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(top);
    expect(cryptoCompareAPI.getTopCoins).toHaveBeenCalledWith(5, 'USD');
  });
});
