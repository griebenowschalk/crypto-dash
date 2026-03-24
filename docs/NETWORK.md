# Network — APIs, transport, environment

## CryptoCompare

- **REST** — `src/lib/cryptocompare.ts` (`CryptoCompareAPI`)
  - Coin list, top coins, multi-symbol prices, historical OHLCV.
- **WebSocket** — `src/lib/cryptocompare-websocket.ts`
  - Live price ticks; used by `useCryptoPrice` after REST seed.

## Base URL selection

`cryptocompare.ts` resolves `BASE_URL` in this order:

1. `import.meta.env.VITE_CRYPTOCOMPARE_PROXY_BASE_URL` — explicit override (any deployment).
2. **Production** default: `/.netlify/functions/cryptocompare` — Netlify function proxy (see `netlify/functions/cryptocompare.js`).
3. **Development** default: `https://min-api.cryptocompare.com/data` — direct API (browser must allow CORS; key often required).

## Environment variables

| Variable                            | Purpose                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `VITE_CRYPTOCOMPARE_API_KEY`        | API key sent from the client when calling CryptoCompare (or via your proxy). |
| `VITE_CRYPTOCOMPARE_PROXY_BASE_URL` | Optional; force REST base URL (e.g. custom proxy).                           |

**Note:** Keys in `VITE_*` are exposed to the client bundle. For production, prefer a serverless/proxy that injects the key server-side.

## Images

Coin `imageUrl` values may be relative; `CryptoCompareAPI.normalizeImageUrl()` prefixes `https://www.cryptocompare.com` when needed.

## React Query / caching (network-adjacent)

Typical keys and policies live next to hooks (e.g. `['topCoins', limit, currency]`, `['allCoins']` with long `staleTime`). See [STATE.md](./STATE.md) for the full picture.

## PWA / offline

`vite-plugin-pwa` registers a service worker; runtime caching can include API patterns (see `vite.config.ts`). This does not replace auth or secrets handling — it only affects how assets and some requests are cached in the browser.
