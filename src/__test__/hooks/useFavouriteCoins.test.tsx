import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFavouriteCoins } from '@/hooks/useFavouriteCoins';

function installMemoryLocalStorage() {
  let store: Record<string, string> = {};
  const mock = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: mock,
  });
  return { reset: () => (store = {}) };
}

describe('useFavouriteCoins', () => {
  let resetStorage: () => void;

  beforeEach(() => {
    const { reset } = installMemoryLocalStorage();
    resetStorage = reset;
  });

  afterEach(() => {
    resetStorage();
  });

  it('starts empty when localStorage has no favourites', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.currentFavorite).toBe('');
  });

  it('addFavorite appends and respects max 10', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavorite('BTC');
    });
    act(() => {
      result.current.addFavorite('ETH');
    });
    expect(result.current.favorites).toEqual(['BTC', 'ETH']);
    expect(result.current.isFavorite('BTC')).toBe(true);

    act(() => {
      result.current.addFavorite('BTC');
    });
    expect(result.current.favorites).toHaveLength(2);

    const coins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (const s of coins) {
      act(() => {
        result.current.addFavorite(s);
      });
    }
    expect(result.current.favorites).toHaveLength(10);

    act(() => {
      result.current.addFavorite('TOO_MANY');
    });
    expect(result.current.favorites).toHaveLength(10);
    expect(result.current.favorites).not.toContain('TOO_MANY');
  });

  it('removeFavorite updates currentFavorite when removing active coin', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavorite('BTC');
    });
    act(() => {
      result.current.addFavorite('ETH');
    });
    act(() => {
      result.current.setCurrentFavorite('BTC');
    });
    expect(result.current.currentFavorite).toBe('BTC');

    act(() => {
      result.current.removeFavorite('BTC');
    });
    expect(result.current.favorites).toEqual(['ETH']);
    expect(result.current.currentFavorite).toBe('ETH');
  });

  it('setCurrentFavorite only when coin is a favourite', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavorite('BTC');
      result.current.setCurrentFavorite('ETH');
    });
    expect(result.current.currentFavorite).toBe('');

    act(() => {
      result.current.setCurrentFavorite('BTC');
    });
    expect(result.current.currentFavorite).toBe('BTC');
  });

  it('resetFavorites restores defaults', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavorite('SOL');
      result.current.resetFavorites();
    });
    expect(result.current.favorites).toEqual(['BTC', 'ETH', 'XMR']);
    expect(result.current.currentFavorite).toBe('BTC');
  });
});
