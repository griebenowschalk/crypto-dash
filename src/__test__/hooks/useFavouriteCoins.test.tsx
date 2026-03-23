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

    expect(result.current.favourites).toEqual([]);
    expect(result.current.currentFavourite).toBe('');
  });

  it('addFavourite appends and respects max 10', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavourite('BTC');
    });
    act(() => {
      result.current.addFavourite('ETH');
    });
    expect(result.current.favourites).toEqual(['BTC', 'ETH']);
    expect(result.current.isFavourite('BTC')).toBe(true);

    act(() => {
      result.current.addFavourite('BTC');
    });
    expect(result.current.favourites).toHaveLength(2);

    const coins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (const s of coins) {
      act(() => {
        result.current.addFavourite(s);
      });
    }
    expect(result.current.favourites).toHaveLength(10);

    act(() => {
      result.current.addFavourite('TOO_MANY');
    });
    expect(result.current.favourites).toHaveLength(10);
    expect(result.current.favourites).not.toContain('TOO_MANY');
  });

  it('removeFavourite updates currentFavourite when removing active coin', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavourite('BTC');
    });
    act(() => {
      result.current.addFavourite('ETH');
    });
    act(() => {
      result.current.setCurrentFavourite('BTC');
    });
    expect(result.current.currentFavourite).toBe('BTC');

    act(() => {
      result.current.removeFavourite('BTC');
    });
    expect(result.current.favourites).toEqual(['ETH']);
    expect(result.current.currentFavourite).toBe('ETH');
  });

  it('setCurrentFavourite only when coin is a favourite', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavourite('BTC');
      result.current.setCurrentFavourite('ETH');
    });
    expect(result.current.currentFavourite).toBe('');

    act(() => {
      result.current.setCurrentFavourite('BTC');
    });
    expect(result.current.currentFavourite).toBe('BTC');
  });

  it('toggleFavourite adds, removes, and respects max 10', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.toggleFavourite('BTC');
    });
    expect(result.current.favourites).toContain('BTC');

    act(() => {
      result.current.toggleFavourite('BTC');
    });
    expect(result.current.favourites).not.toContain('BTC');

    const coins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (const s of coins) {
      act(() => {
        result.current.toggleFavourite(s);
      });
    }
    expect(result.current.favourites).toHaveLength(10);

    act(() => {
      result.current.toggleFavourite('EXTRA');
    });
    expect(result.current.favourites).not.toContain('EXTRA');
  });

  it('resetFavourites restores defaults', () => {
    const { result } = renderHook(() => useFavouriteCoins());

    act(() => {
      result.current.addFavourite('SOL');
      result.current.resetFavourites();
    });
    expect(result.current.favourites).toEqual(['BTC', 'ETH']);
    expect(result.current.currentFavourite).toBe('BTC');
  });
});
