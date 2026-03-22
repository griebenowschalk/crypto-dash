import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { cryptoCompareWebSocket } from '@/lib/cryptocompare-websocket';
import { createQueryClientWrapper } from '@/__test__/test-utils';

vi.mock('@/lib/cryptocompare', () => ({
  cryptoCompareAPI: {
    getPrice: vi.fn(),
  },
}));

vi.mock('@/lib/cryptocompare-websocket', () => ({
  cryptoCompareWebSocket: {
    subscribe: vi.fn(() => () => {}),
  },
}));

const priceRaw = {
  TYPE: '5',
  FROMSYMBOL: 'BTC',
  TOSYMBOL: 'ZAR',
  PRICE: 1_000_000,
  CHANGE24HOUR: 100,
  CHANGEPCT24HOUR: 1.5,
  HIGH24HOUR: 2,
  LOW24HOUR: 0.5,
  VOLUME24HOURTO: 999,
  LASTUPDATE: 123,
  OPEN24HOUR: 900,
  MKTCAP: 1e12,
};

describe('useCryptoPrice', () => {
  beforeEach(() => {
    vi.mocked(cryptoCompareAPI.getPrice).mockResolvedValue(priceRaw);
  });

  it('loads initial price and subscribes websocket', async () => {
    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useCryptoPrice('BTC', 'ZAR'), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(cryptoCompareWebSocket.subscribe).toHaveBeenCalledWith(
      ['BTC'],
      'ZAR',
      expect.any(Function)
    );

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        price: 1_000_000,
        changePct24h: 1.5,
      });
    });
  });
});
