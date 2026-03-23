import { getAppCurrency, setAppCurrency } from '@/lib/local-storage';
import type { Currency } from '@/types/crypto';

export const DEFAULT_APP_CURRENCY: Currency = 'ZAR';

let appCurrency: Currency = getAppCurrency() ?? DEFAULT_APP_CURRENCY;
const currencyListeners = new Set<() => void>();

export function subscribeAppCurrency(listener: () => void): () => void {
  currencyListeners.add(listener);
  return () => {
    currencyListeners.delete(listener);
  };
}

export function getAppCurrencySnapshot(): Currency {
  return appCurrency;
}

export function updateAppCurrency(currency: Currency): void {
  appCurrency = currency;
  setAppCurrency(currency);
  currencyListeners.forEach(listener => listener());
}
