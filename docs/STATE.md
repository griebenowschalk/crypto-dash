# State — client data, persistence, preferences

## Server state (TanStack Query)

Used for CryptoCompare REST data. Examples:

- **`useTopCoins`** — `['topCoins', limit, currency]`; top market-cap list for selected fiat/crypto.
- **`useHistoricalData`** — historical series keyed by symbol, currency, timeframe, limit.
- **`useCoinSearch` / `getAllCoins`** — `['allCoins']`; full coin list cached (~1h stale) for client-side fuzzy search.

WebSocket updates in **`useCryptoPrice`** merge into React state on top of the initial query result (not a separate Query key for each tick).

## Local persistence (`localStorage`)

`src/lib/local-storage.ts`

| Key               | Shape                                                | Purpose                                                     |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| `favourite-coins` | `{ favourites: string[], currentFavourite: string }` | Saved favourites + which symbol drives the dashboard chart. |
| `app-currency`    | `Currency` string                                    | Display currency for prices/charts (`USD`, `ZAR`, …).       |
| `theme`           | `light` \| `dark` \| `system`                        | Color mode (see `lib/theme.ts`).                            |

## Module stores (in-memory + sync to `localStorage`)

### Favourites — `src/lib/favourite-coins-store.ts`

- **`MAX_FAVOURITES`** = 10.
- **`subscribeFavouriteCoins` / `getFavouriteCoinsSnapshot` / `updateFavouriteCoinsState`** — external store pattern; **`useFavouriteCoins`** subscribes via `useSyncExternalStore`.
- Removing a coin may clear or reassign **`currentFavourite`** if it was the removed symbol.

### App currency — `src/lib/app-currency-store.ts`

- **`useAppCurrency`** — `useSyncExternalStore`; **`DEFAULT_APP_CURRENCY`** when nothing saved.
- Changing currency invalidates/refetches queries that include currency in the key (`useTopCoins`, price/history hooks).

## UI-only state

- **Theme** — `src/lib/theme.ts` + `useTheme` / `ThemeToggle`. Persisted in `localStorage` under **`theme`** (`light` | `dark` | `system`); applied as the `dark` class on `document.documentElement`.
- **Router** — URL params (e.g. `/coin/BTC`) are source of truth for coin detail symbol.
- **PWA** — `usePWAInstall`, `UpdateNotification` / service worker events (no durable app state).

## Where to extend

- New **remote** data → add `lib/` client method + hook with a **clear `queryKey`**.
- New **user preference** that must survive reload → add key in `local-storage.ts` + small store module if you need cross-component sync without prop drilling.
