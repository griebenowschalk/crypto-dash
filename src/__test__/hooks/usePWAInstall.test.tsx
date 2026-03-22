import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import usePWAInstall from '@/hooks/usePWAInstall';

function mockStandaloneDisplayMode() {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
  );
}

describe('usePWAInstall', () => {
  it('captures beforeinstallprompt and can install', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);
    expect(result.current.isInstalled).toBe(false);

    let accepted: boolean | undefined;
    await act(async () => {
      accepted = await result.current.install();
    });
    expect(accepted).toBe(true);
    expect(result.current.isInstalled).toBe(true);
  });

  it('reports installed when display-mode is standalone', async () => {
    mockStandaloneDisplayMode();

    const { result } = renderHook(() => usePWAInstall());

    await waitFor(() => expect(result.current.isInstalled).toBe(true));
    expect(result.current.canInstall).toBe(false);

    vi.restoreAllMocks();
  });
});
