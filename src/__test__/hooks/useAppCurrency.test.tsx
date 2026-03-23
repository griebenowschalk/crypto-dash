import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
}

describe('useAppCurrency', () => {
  beforeEach(() => {
    installMemoryLocalStorage();
    vi.resetModules();
  });

  it('defaults to ZAR and exposes currency options', async () => {
    const { useAppCurrency } = await import('@/hooks/useAppCurrency');
    const { result } = renderHook(() => useAppCurrency());

    expect(result.current.currency).toBe('ZAR');
    expect(result.current.options[0].value).toBe('ZAR');
  });

  it('updates currency and syncs across subscribers', async () => {
    const { useAppCurrency } = await import('@/hooks/useAppCurrency');

    const first = renderHook(() => useAppCurrency());
    const second = renderHook(() => useAppCurrency());

    act(() => {
      first.result.current.setCurrency('USD');
    });

    expect(first.result.current.currency).toBe('USD');
    expect(second.result.current.currency).toBe('USD');
    expect(window.localStorage.getItem('app-currency')).toBe('USD');
  });
});
