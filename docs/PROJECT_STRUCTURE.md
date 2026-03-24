# Project structure (assets and build output)

For application architecture and routes, see [README.md](./README.md) and [CORE.md](./CORE.md). This file focuses on where static assets live and what the toolchain generates.

## Source assets (`src/assets/`)

Processed by Vite. Import from application code:

| File            | Role                                    |
| --------------- | --------------------------------------- |
| `favicon.svg`   | Source favicon                          |
| `logo-icon.svg` | Logo used in UI (e.g. `Logo` component) |

Example:

```typescript
import logoIcon from '@/assets/logo-icon.svg';
```

## Public assets (`public/`)

Served at the site root. Use absolute paths such as `/favicon.svg`.

| Path          | Role                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `favicon.svg` | Browser favicon                                                                                                                                                                         |
| `icons/`      | PWA icons referenced by the web app manifest in `vite.config.ts` (`/icons/icon-192x192.png`, `/icons/icon-512x512.png`). The folder may also contain `README.md` with generation notes. |

HTML reference example:

```html
<link rel="icon" href="/favicon.svg" />
```

## Generated output

| Location    | When                                       | Contents                                                               |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| `dist/`     | `npm run build`                            | Production bundle, hashed assets, injected PWA artifacts as configured |
| `dev-dist/` | `npm run dev` with PWA dev options enabled | Dev-time PWA-related output (see project `eslint` ignores)             |

Service worker and Workbox runtime are produced by `vite-plugin-pwa` according to `vite.config.ts`; they ship with the build output rather than as hand-edited sources under `src/`.

## Netlify

`netlify/functions/` holds serverless handlers (for example the CryptoCompare proxy). Not part of the Vite `src/` tree.

## Icon sources

If you add PNGs under `public/icons/`, you can generate them from `src/assets/logo-icon.svg` using standard tooling (for example [RealFaviconGenerator](https://realfavicongenerator.net/) or [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator)).
