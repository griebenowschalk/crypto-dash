import { FavouriteCoinsState } from '@/types/crypto';
import type { Currency } from '@/types/crypto';

const FAVOURITE_COINS_KEY = 'favourite-coins';
const APP_CURRENCY_KEY = 'app-currency';

export function clearFavourites(): void {
  localStorage.removeItem(FAVOURITE_COINS_KEY);
}

export function getFavourites(): FavouriteCoinsState {
  try {
    const favourites = localStorage.getItem(FAVOURITE_COINS_KEY);
    return favourites
      ? JSON.parse(favourites)
      : { favourites: [], currentFavourite: '' };
  } catch (error) {
    console.error('Error getting favourites:', error);

    return { favourites: [], currentFavourite: '' };
  }
}

export function setFavourites(favourites: FavouriteCoinsState): void {
  try {
    localStorage.setItem(FAVOURITE_COINS_KEY, JSON.stringify(favourites));
  } catch (error) {
    console.error('Error setting favourites:', error);
  }
}

export function getAppCurrency(): Currency | null {
  try {
    const value = localStorage.getItem(APP_CURRENCY_KEY);
    return value ? (value as Currency) : null;
  } catch (error) {
    console.error('Error getting app currency:', error);
    return null;
  }
}

export function setAppCurrency(currency: Currency): void {
  try {
    localStorage.setItem(APP_CURRENCY_KEY, currency);
  } catch (error) {
    console.error('Error setting app currency:', error);
  }
}
