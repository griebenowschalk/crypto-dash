import { useState, useEffect } from 'react';
import { getFavourites, setFavourites } from '@/lib/local-storage';
import { FavouriteCoinsState } from '@/types/crypto';

const MAX_FAVOURITES = 10;
const DEFAULT_FAVOURITES = ['BTC', 'ETH', 'XMR'];

export function useFavouriteCoins() {
  const [state, setState] = useState<FavouriteCoinsState>(() => {
    const savedFavourites = getFavourites();

    return (
      savedFavourites || {
        favourites: DEFAULT_FAVOURITES,
        currentFavourite: DEFAULT_FAVOURITES[0],
      }
    );
  });
  const [firstVisit, setFirstVisit] = useState(() => {
    return !getFavourites();
  });

  useEffect(() => {
    setFavourites(state);
  }, [state]);

  const addFavourite = (coin: string) => {
    if (state.favourites.includes(coin)) return;
    if (state.favourites.length >= MAX_FAVOURITES) return;
    setState({
      ...state,
      favourites: [...state.favourites, coin],
    });
  };

  const removeFavourite = (coin: string) => {
    setState(prevState => {
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

    setState(prevState => {
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
    setState({
      favourites: DEFAULT_FAVOURITES,
      currentFavourite: DEFAULT_FAVOURITES[0],
    });
  };

  const isFavourite = (coin: string) => {
    return state.favourites.includes(coin);
  };

  const toggleFavourite = (coin: string) => {
    setState(prevState => {
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
