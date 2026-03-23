import { useSyncExternalStore } from 'react';
import type { Currency } from '@/types/crypto';
import {
  DEFAULT_APP_CURRENCY,
  getAppCurrencySnapshot,
  subscribeAppCurrency,
  updateAppCurrency,
} from '@/lib/app-currency-store';

export const APP_CURRENCY_OPTIONS: Array<{ value: Currency; label: string }> = [
  { value: 'ZAR', label: 'South African Rand (ZAR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
];

export function useAppCurrency() {
  const currency = useSyncExternalStore(
    subscribeAppCurrency,
    getAppCurrencySnapshot,
    getAppCurrencySnapshot
  );

  return {
    currency: currency ?? DEFAULT_APP_CURRENCY,
    setCurrency: (next: Currency) => updateAppCurrency(next),
    options: APP_CURRENCY_OPTIONS,
  };
}
