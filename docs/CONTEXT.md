# CryptoDash implementation context

High-level build and architecture reference. Topic-specific detail lives in [README.md](./README.md) ([CORE.md](./CORE.md), [NETWORK.md](./NETWORK.md), [STATE.md](./STATE.md)).

## What the app does

Client-side dashboard: live prices (REST plus WebSocket), historical charts, user favourites (cap 10), markets table with search, settings for display currency and favourite coins. Dark and light themes.

## Technology

| Area        | Choice                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------- |
| UI          | React 19, TypeScript                                                                                |
| Build       | Vite 7                                                                                              |
| Routing     | TanStack Router, file routes under `src/routes/`                                                    |
| Remote data | TanStack Query                                                                                      |
| Styling     | Tailwind CSS 4                                                                                      |
| Components  | shadcn-style primitives in `src/components/ui/`                                                     |
| Charts      | Recharts                                                                                            |
| Data source | CryptoCompare REST and WebSocket (`src/lib/cryptocompare.ts`, `src/lib/cryptocompare-websocket.ts`) |
| Unit tests  | Vitest, Testing Library ([TESTING.md](./TESTING.md))                                                |

## Bootstrap

1. `index.html` loads `src/main.tsx`.
2. `main.tsx` calls `initTheme()` (`src/lib/theme.ts`), creates a `QueryClient`, and renders `RouterProvider` with the generated route tree (`src/routeTree.gen.ts` from `@tanstack/router-plugin`).

## Directory layout (current)

```
src/
├── main.tsx                 # Entry: providers + router
├── index.css                # Global styles, theme tokens
├── routeTree.gen.ts         # Generated (do not edit)
├── routes/                  # TanStack file routes
│   ├── __root.tsx
│   ├── index.tsx            # Redirect /
│   ├── dashboard.tsx
│   ├── markets.tsx
│   ├── settings.tsx
│   └── coin/$symbol.tsx
├── pages/                   # Screen components used by routes
│   ├── Dashboard.tsx
│   ├── Markets.tsx
│   ├── Settings.tsx
│   └── CoinDetail.tsx
├── components/
│   ├── typography.tsx       # H1–H4, P, Muted, Small, SectionLabel, …
│   ├── theme-toggle.tsx
│   ├── layout/              # Header, Container, Logo, Loader
│   ├── crypto/              # PriceCard, PriceChart, Sparkline
│   ├── pwa/                 # InstallPrompt, UpdateNotification
│   └── ui/                  # button, card, select, tabs, skeleton, …
├── hooks/                   # useCryptoPrice, useHistoricalData, useTopCoins,
│                            # useCoinSearch, useFavouriteCoins, useAppCurrency,
│                            # useTheme, usePWAInstall
├── lib/                     # API clients, stores, utils, chart presets
└── types/
    └── crypto.ts            # Shared domain types
```

## Routes and pages

| Path            | Route module              | Page                     |
| --------------- | ------------------------- | ------------------------ |
| `/`             | `routes/index.tsx`        | Redirect to `/dashboard` |
| `/dashboard`    | `routes/dashboard.tsx`    | `Dashboard`              |
| `/markets`      | `routes/markets.tsx`      | `Markets`                |
| `/coin/$symbol` | `routes/coin/$symbol.tsx` | `CoinDetail`             |
| `/settings`     | `routes/settings.tsx`     | `Settings`               |

Root layout (`__root.tsx`): `Container`, `Header`, `Outlet`, PWA overlays.

## Data and side effects

- **Prices**: `useCryptoPrice` seeds from REST, then applies WebSocket ticks.
- **History**: `useHistoricalData` with timeframe presets in `lib/chart-timeframes.ts`.
- **Lists**: `useTopCoins`, `useCoinSearch` (cached full coin list, client fuzzy filter).
- **User preferences**: favourites and featured chart symbol, app currency, theme. See [STATE.md](./STATE.md).

## API and environment

Base URL selection, proxy, and keys are documented in [NETWORK.md](./NETWORK.md).

## UI conventions

- Prefer `@/components/typography` for visible headings and body copy on screens and shared widgets.
- Paths use the `@/` alias to `src/` (see `tsconfig.json` and `vite.config.ts`).

## PWA

Configured in `vite.config.ts` via `vite-plugin-pwa` (manifest, Workbox). Install and update UI: `components/pwa/`. Asset layout under `public/` is described in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Further reading

| Document                                             | Use                             |
| ---------------------------------------------------- | ------------------------------- |
| [CORE.md](./CORE.md)                                 | Product summary and conventions |
| [NETWORK.md](./NETWORK.md)                           | Transport and env               |
| [STATE.md](./STATE.md)                               | Query keys and persistence      |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)       | Assets and build outputs        |
| [TESTING.md](./TESTING.md)                           | Tests and CI                    |
| [IMPLEMENTATION_ORDER.md](./IMPLEMENTATION_ORDER.md) | Historical phased checklist     |
