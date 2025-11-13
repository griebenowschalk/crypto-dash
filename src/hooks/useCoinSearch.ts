import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cryptoCompareAPI } from '@/lib/cryptocompare';
import { CoinInfo } from '@/types/crypto';

/**
 * Fuzzy search helper - filters coins by symbol or name
 */
function fuzzySearch(query: string, coins: CoinInfo[]): CoinInfo[] {
  if (!query.trim()) return coins;

  const lowerQuery = query.toLowerCase();
  const results: CoinInfo[] = [];

  for (const coin of coins) {
    const symbolMatch = coin.symbol.toLowerCase().includes(lowerQuery);
    const nameMatch = coin.name.toLowerCase().includes(lowerQuery);

    if (symbolMatch || nameMatch) {
      results.push(coin);
    }
  }

  return results.sort((a, b) => {
    const aSymbolExact = a.symbol.toLowerCase() === lowerQuery;
    const bSymbolExact = b.symbol.toLowerCase() === lowerQuery;
    if (aSymbolExact && !bSymbolExact) return -1;
    if (!aSymbolExact && bSymbolExact) return 1;

    const aStartsWith = a.symbol.toLowerCase().startsWith(lowerQuery);
    const bStartsWith = b.symbol.toLowerCase().startsWith(lowerQuery);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    return 0;
  });
}

/**
 * Hook for live debounced coin search.
 *
 * Fetches all coins once (cached with React Query), then filters client-side
 * with debounce. Perfect for live search without API calls on every keystroke.
 */
export function useCoinSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fetch all coins once, cache for 1 hour
  const {
    data: allCoins = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allCoins'],
    queryFn: () => cryptoCompareAPI.getAllCoins(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    return fuzzySearch(debouncedQuery, allCoins);
  }, [debouncedQuery, allCoins]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    allCoins,
  };
}
