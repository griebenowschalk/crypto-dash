import { getFavourites, setFavourites } from '@/lib/local-storage';
import type { FavouriteCoinsState } from '@/types/crypto';

export const MAX_FAVOURITES = 10;
export const EMPTY_FAVOURITES_STATE: FavouriteCoinsState = {
  favourites: [],
  currentFavourite: '',
};
export const DEFAULT_FAVOURITES = ['BTC', 'ETH'] as const;
export const DEFAULT_FAVOURITES_STATE: FavouriteCoinsState = {
  favourites: [...DEFAULT_FAVOURITES],
  currentFavourite: DEFAULT_FAVOURITES[0],
};

let sharedFavouriteState: FavouriteCoinsState = (() => {
  const saved = getFavourites();
  if (saved?.favourites?.length) {
    return saved;
  }
  return EMPTY_FAVOURITES_STATE;
})();

const favouriteListeners = new Set<() => void>();

export function subscribeFavouriteCoins(listener: () => void): () => void {
  favouriteListeners.add(listener);
  return () => {
    favouriteListeners.delete(listener);
  };
}

export function getFavouriteCoinsSnapshot(): FavouriteCoinsState {
  // Keep module state in sync with persisted storage (helps HMR/tests).
  const persisted = getFavourites();
  if (JSON.stringify(persisted) !== JSON.stringify(sharedFavouriteState)) {
    sharedFavouriteState = persisted;
  }
  return sharedFavouriteState;
}

export function updateFavouriteCoinsState(
  updater:
    | FavouriteCoinsState
    | ((prev: FavouriteCoinsState) => FavouriteCoinsState)
): void {
  const nextState =
    typeof updater === 'function' ? updater(sharedFavouriteState) : updater;
  sharedFavouriteState = nextState;
  setFavourites(sharedFavouriteState);
  favouriteListeners.forEach(listener => listener());
}
