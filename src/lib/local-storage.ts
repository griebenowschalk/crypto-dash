import { FavoriteCoinsState } from '@/types/crypto';

const FAVORITE_COINS_KEY = 'favorite-coins';

export function clearFavourites(): void {
  localStorage.removeItem(FAVORITE_COINS_KEY);
}

export function getFavourites(): FavoriteCoinsState {
  try {
    const favourites = localStorage.getItem(FAVORITE_COINS_KEY);
    return favourites
      ? JSON.parse(favourites)
      : { favorites: [], currentFavorite: '' };
  } catch (error) {
    console.error('Error getting favourites:', error);

    return { favorites: [], currentFavorite: '' };
  }
}

export function setFavourites(favourites: FavoriteCoinsState): void {
  try {
    localStorage.setItem(FAVORITE_COINS_KEY, JSON.stringify(favourites));
  } catch (error) {
    console.error('Error setting favourites:', error);
  }
}
