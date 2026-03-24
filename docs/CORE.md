# Core — product, stack, structure

## What it is

CryptoDash is a client-side crypto dashboard: live prices, historical charts, favourites, markets table, and settings (currency + favourite coins). Deployed as a static SPA (Vite) with optional Netlify serverless proxy for the API.

## Stack (current)

- **React** + **TypeScript** + **Vite**
- **TanStack Router** — file routes under `src/routes/`
- **TanStack Query** — server state (REST, cached coin list)
- **Tailwind CSS v4** + **shadcn/ui**-style primitives in `src/components/ui/`
- **Recharts** — charts / sparklines
- **Typography** — `@/components/typography` (`H1`–`H4`, `P`, `Muted`, `Small`, `SectionLabel`, …) for page copy; prefer these over raw `<h1>`/`<p>` in features.

## Routes & pages

| Path            | Route file                | Page component          |
| --------------- | ------------------------- | ----------------------- |
| `/`             | `routes/index.tsx`        | Redirect → `/dashboard` |
| `/dashboard`    | `routes/dashboard.tsx`    | `pages/Dashboard.tsx`   |
| `/markets`      | `routes/markets.tsx`      | `pages/Markets.tsx`     |
| `/coin/$symbol` | `routes/coin/$symbol.tsx` | `pages/CoinDetail.tsx`  |
| `/settings`     | `routes/settings.tsx`     | `pages/Settings.tsx`    |

Root shell: `routes/__root.tsx` — `Header`, `Container`, `Outlet`, PWA prompts.

## Feature summary

- **Dashboard** — Grid of favourite (or fallback top) coins via `PriceCard`; featured coin drives `PriceChart`.
- **Markets** — Searchable table; star toggles favourites.
- **Coin detail** — Price header, chart, stat cards.
- **Settings** — App currency (`useAppCurrency`) + favourite list with search/add/remove (max 10).
- **Theme** — Light/dark via `ThemeToggle` / `lib/theme.ts` (see STATE.md).

## Source layout (high level)

```
src/
├── routes/           # TanStack file routes
├── pages/            # Route-mounted screens
├── components/
│   ├── crypto/       # PriceCard, PriceChart, Sparkline
│   ├── layout/       # Header, Container, Logo, Loader
│   ├── pwa/          # InstallPrompt, UpdateNotification
│   ├── typography.tsx
│   └── ui/           # shadcn-style primitives
├── hooks/            # Data + preferences hooks
├── lib/              # API clients, stores, utils
└── types/crypto.ts   # Shared types
```

## Conventions

- Import paths use `@/` → `src/` (see `tsconfig` / `vite.config`).
- **Text:** Use `@/components/typography` for user-visible headings and body on pages and shared widgets unless you need a bare `<span>` for layout-only reasons.
