import { useState, useEffect } from 'react';
import { getFavourites, setFavourites } from '@/lib/local-storage';
import { FavoriteCoinsState } from '@/types/crypto';

const MAX_FAVOURITES = 10;
const DEFAULT_FAVOURITES = ['BTC', 'ETH', 'XMR'];

export function useFavouriteCoins() {
  const [state, setState] = useState<FavoriteCoinsState>(() => {
    const savedFavourites = getFavourites();

    return (
      savedFavourites || {
        favorites: DEFAULT_FAVOURITES,
        currentFavorite: DEFAULT_FAVOURITES[0],
      }
    );
  });
  const [firstVisit, setFirstVisit] = useState(() => {
    return !getFavourites();
  });

  useEffect(() => {
    setFavourites(state);
  }, [state]);

  const addFavorite = (coin: string) => {
    if (state.favorites.includes(coin)) return;
    if (state.favorites.length >= MAX_FAVOURITES) return;
    setState({
      ...state,
      favorites: [...state.favorites, coin],
    });
  };

  const removeFavorite = (coin: string) => {
    setState(prevState => {
      const newFavorites = prevState.favorites.filter(c => c !== coin);
      const currentFavorite =
        prevState.currentFavorite === coin
          ? newFavorites[0] || ''
          : prevState.currentFavorite;

      return {
        ...prevState,
        favorites: newFavorites,
        currentFavorite,
      };
    });
  };

  const setCurrentFavorite = (coin: string) => {
    if (!isFavorite(coin)) return;

    setState(prevState => {
      return {
        ...prevState,
        currentFavorite: coin,
      };
    });
  };

  const containsFavorite = () => {
    if (state.favorites.length === 0) return;

    setFirstVisit(false);
    setFavourites(state);
  };

  const resetFavorites = () => {
    setState({
      favorites: DEFAULT_FAVOURITES,
      currentFavorite: DEFAULT_FAVOURITES[0],
    });
  };

  const isFavorite = (coin: string) => {
    return state.favorites.includes(coin);
  };

  return {
    favorites: state.favorites,
    currentFavorite: state.currentFavorite,
    firstVisit,
    addFavorite,
    removeFavorite,
    setCurrentFavorite,
    resetFavorites,
    isFavorite,
    containsFavorite,
  };
}
