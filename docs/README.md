# CryptoDash documentation

Split reference for the repo. Use these instead of scrolling one giant guide.

| Doc                        | What it covers                                                      |
| -------------------------- | ------------------------------------------------------------------- |
| [CORE.md](./CORE.md)       | Product summary, stack, routes, layout, source tree, UI conventions |
| [NETWORK.md](./NETWORK.md) | CryptoCompare REST/WebSocket, proxies, env vars, caching            |
| [STATE.md](./STATE.md)     | React Query, localStorage, favourites & currency stores, theme      |

## Other files in `docs/`

- [TESTING.md](./TESTING.md) — Vitest, patterns, CI.
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — assets, PWA outputs, icons.
- [CONTEXT.md](./CONTEXT.md) — concise implementation context (stack, layout, routes, pointers).
- `poc/` — static HTML mocks for visuals.

## Contributing

When you change data flow or API usage, update **STATE.md** and/or **NETWORK.md**. When you add routes or major UI areas, update **CORE.md**.
