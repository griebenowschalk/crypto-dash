import { useState, useSyncExternalStore } from 'react';
import { getFavourites, setFavourites } from '@/lib/local-storage';
import {
  DEFAULT_FAVOURITES_STATE,
  getFavouriteCoinsSnapshot,
  MAX_FAVOURITES,
  subscribeFavouriteCoins,
  updateFavouriteCoinsState,
} from '@/lib/favourite-coins-store';

export function useFavouriteCoins() {
  const state = useSyncExternalStore(
    subscribeFavouriteCoins,
    getFavouriteCoinsSnapshot,
    getFavouriteCoinsSnapshot
  );
  const [firstVisit, setFirstVisit] = useState(() => {
    return !getFavourites();
  });

  const addFavourite = (coin: string) => {
    if (state.favourites.includes(coin)) return;
    if (state.favourites.length >= MAX_FAVOURITES) return;
    updateFavouriteCoinsState({
      ...state,
      favourites: [...state.favourites, coin],
    });
  };

  const removeFavourite = (coin: string) => {
    updateFavouriteCoinsState(prevState => {
      const newFavourites = prevState.favourites.filter(c => c !== coin);
      const currentFavourite =
        prevState.currentFavourite === coin
          ? newFavourites[0] || ''
          : prevState.currentFavourite;

      return {
        ...prevState,
        favourites: newFavourites,
        currentFavourite,
      };
    });
  };

  const setCurrentFavourite = (coin: string) => {
    if (!isFavourite(coin)) return;

    updateFavouriteCoinsState(prevState => {
      return {
        ...prevState,
        currentFavourite: coin,
      };
    });
  };

  const containsFavourite = () => {
    if (state.favourites.length === 0) return;

    setFirstVisit(false);
    setFavourites(state);
  };

  const resetFavourites = () => {
    updateFavouriteCoinsState(DEFAULT_FAVOURITES_STATE);
  };

  const isFavourite = (coin: string) => {
    return state.favourites.includes(coin);
  };

  const toggleFavourite = (coin: string) => {
    updateFavouriteCoinsState(prevState => {
      if (prevState.favourites.includes(coin)) {
        const newFavourites = prevState.favourites.filter(c => c !== coin);
        const currentFavourite =
          prevState.currentFavourite === coin
            ? newFavourites[0] || ''
            : prevState.currentFavourite;
        return {
          ...prevState,
          favourites: newFavourites,
          currentFavourite,
        };
      }
      if (prevState.favourites.length >= MAX_FAVOURITES) {
        return prevState;
      }
      return {
        ...prevState,
        favourites: [...prevState.favourites, coin],
      };
    });
  };

  return {
    favourites: state.favourites,
    currentFavourite: state.currentFavourite,
    firstVisit,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    setCurrentFavourite,
    resetFavourites,
    isFavourite,
    containsFavourite,
  };
}
