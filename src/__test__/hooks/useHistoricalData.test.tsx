import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { createQueryClientWrapper } from '@/__test__/test-utils';

vi.mock('@/lib/cryptocompare', () => ({
  cryptoCompareAPI: {
    getHistoricalData: vi.fn(),
  },
}));

const points = [
  {
    time: 1,
    open: 1,
    high: 2,
    low: 0.5,
    close: 1.5,
    volumefrom: 1,
    volumeto: 1,
  },
];

describe('useHistoricalData', () => {
  beforeEach(() => {
    vi.mocked(cryptoCompareAPI.getHistoricalData).mockResolvedValue(points);
  });

  it('loads historical series for coin', async () => {
    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(
      () => useHistoricalData('BTC', 'ZAR', 'day', 14),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(points);
    expect(cryptoCompareAPI.getHistoricalData).toHaveBeenCalledWith(
      'BTC',
      'ZAR',
      'day',
      14
    );
  });
});
