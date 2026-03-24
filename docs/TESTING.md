# Testing Guide

**Stack:** Vitest + Testing Library (unit/component) · Playwright (E2E)
**CI:** GitHub Actions — both run on every push/PR to `main`

---

## What's Already Set Up

You don't need to configure Vitest from scratch — it's done:

| File                       | Purpose                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `vitest.config.ts`         | Vitest config: jsdom env, `@` alias, **istanbul** coverage (LCOV plays nice with Codecov; v8 can emit invalid BRDA) |
| `src/__test__/setup.ts`    | Global mocks: `matchMedia`, `localStorage`                                                                          |
| `package.json` scripts     | `test`, `test:ui`, `test:coverage`                                                                                  |
| `.github/workflows/ci.yml` | Runs lint → type-check → `test:coverage` on push                                                                    |

Playwright is **not installed yet** — see Step 1 below.

---

## Part 1 — Vitest Unit & Component Tests

### Mental model

Think of your tests in two layers:

1. **Logic tests** — pure functions and hooks, no rendering. Fast, no DOM needed.
2. **Component tests** — render a component, interact with it, assert on the output.

For this app, focus on logic tests first. They give you the most confidence for the least effort.

---

### What to test (and what not to)

**Test these:**

- `src/lib/utils.ts` — `formatPrice`, `formatPercentage`, `formatCompact`, `formatTimestamp`
- `src/lib/local-storage.ts` — get/set/clear favourites
- `src/hooks/useFavouriteCoins.ts` — add, remove, toggle, max-10 cap, localStorage persistence
- `src/components/crypto/PriceCard.tsx` — renders coin name, price, favourite star
- `src/components/crypto/Sparkline.tsx` — renders without crashing with empty/populated data
- `src/components/navigation/SearchBar.tsx` (once built) — typing triggers onChange

**Don't bother testing:**

- TanStack Router navigation (tested by Playwright)
- WebSocket reconnect logic (tested by integration/E2E or not at all — too brittle to mock reliably)
- shadcn/ui primitives (third-party, not your code)
- Recharts internals

---

### File structure convention

Tests live under `src/__test__/` (mirror source paths where helpful):

```
src/
├── __test__/
│   ├── setup.ts
│   ├── test-utils.tsx
│   ├── Dashboard.test.tsx
│   ├── hooks/
│   │   └── useFavouriteCoins.test.tsx
│   └── components/layout/
│       └── Header.test.tsx
├── lib/
│   └── utils.ts
└── hooks/
    └── useFavouriteCoins.ts
```

Vitest picks up any `*.test.ts` or `*.test.tsx` file automatically.

---

### Writing a logic test (utils)

```ts
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice, formatPercentage } from './utils';

describe('formatPrice', () => {
  it('formats a whole number', () => {
    expect(formatPrice(50000)).toBe('$50,000.00');
  });

  it('formats a sub-dollar value', () => {
    expect(formatPrice(0.000123)).toBe('$0.000123');
  });
});

describe('formatPercentage', () => {
  it('prefixes positive values with +', () => {
    expect(formatPercentage(5.23)).toBe('+5.23%');
  });

  it('does not double-prefix negative values', () => {
    expect(formatPercentage(-2.1)).toBe('-2.10%');
  });
});
```

Check the actual output of `formatPrice` first — run `npm run test:ui` and look at the failure message to see what it actually returns, then write your assertion to match.

---

### Writing a hook test

Hooks need a React context to run. Use `renderHook` from Testing Library:

```ts
// src/hooks/useFavouriteCoins.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useFavouriteCoins } from './useFavouriteCoins';

// localStorage is already mocked in src/__test__/setup.ts
// but the mock returns null by default — you may want a real implementation
// for this hook. Use vi.spyOn or override the mock per test.

describe('useFavouriteCoins', () => {
  it('starts with default favourites', () => {
    const { result } = renderHook(() => useFavouriteCoins());
    expect(result.current.favourites).toContain('BTC');
  });

  it('toggles a coin in and out', () => {
    const { result } = renderHook(() => useFavouriteCoins());
    act(() => result.current.toggleFavourite('SOL'));
    expect(result.current.isFavourite('SOL')).toBe(true);
    act(() => result.current.toggleFavourite('SOL'));
    expect(result.current.isFavourite('SOL')).toBe(false);
  });

  it('does not exceed 10 favourites', () => {
    const { result } = renderHook(() => useFavouriteCoins());
    const coins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    coins.forEach(c => act(() => result.current.toggleFavourite(c)));
    expect(result.current.favourites.length).toBeLessThanOrEqual(10);
  });
});
```

**Gotcha:** The `localStorage` mock in `src/__test__/setup.ts` always returns `null`. If `useFavouriteCoins` reads from localStorage on mount to restore state, your test won't reflect persistence. You have two options:

- Override the mock per test with `vi.spyOn(window.localStorage, 'getItem').mockReturnValue(...)`
- Or use a real localStorage implementation in tests by replacing the mock in `src/__test__/setup.ts` with `localStorage` from `jest-localstorage-mock` or similar

For now, start with the simple mock and come back to persistence tests once the component tests are passing.

---

### Writing a component test

Components that use hooks fetching live data need their queries mocked. Wrap the component in a `QueryClientProvider` with a test client:

```tsx
// src/components/crypto/PriceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { PriceCard } from './PriceCard';

// Mock the hooks so we control the data
vi.mock('@/hooks/useCryptoPrice', () => ({
  useCryptoPrice: () => ({
    data: { price: 50000, changePct24h: 2.5, change24h: 1250 },
  }),
}));

vi.mock('@/hooks/useHistoricalData', () => ({
  useHistoricalData: () => ({ data: [], isLoading: false }),
}));

// Mock TanStack Router's Link to a plain anchor
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <a {...props}>{children}</a>
  ),
}));

function wrapper({ children }: React.PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const mockCoin = {
  id: 'btc',
  symbol: 'BTC',
  name: 'Bitcoin',
  imageUrl: '/media/19633/btc.png',
};

describe('PriceCard', () => {
  it('renders the coin symbol and name', () => {
    render(<PriceCard coin={mockCoin} />, { wrapper });
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    render(<PriceCard coin={mockCoin} />, { wrapper });
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
  });
});
```

**Key pattern:** `vi.mock(...)` at the top of the file replaces the real module for that test file only. Mock the minimum — return just enough data to make the component render.

---

### Running tests locally

```bash
npm run test          # watch mode
npm run test:ui       # browser UI (great for debugging)
npm run test:coverage # single run + coverage report
```

Coverage report outputs to `coverage/` — open `coverage/index.html` in a browser.

---

## Part 2 — Playwright E2E Tests

### Install

```bash
npm install -D @playwright/test
npx playwright install chromium  # just chromium is enough for CI
```

Add to `package.json` scripts:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

---

### Create `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail if .only left in on CI
  retries: process.env.CI ? 1 : 0, // one retry on CI only
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173', // vite preview port
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

E2E tests run against the production build (`vite preview`), not the dev server. This is intentional — you want to catch build-time issues.

---

### File structure

```
tests/
├── dashboard.spec.ts
├── markets.spec.ts
├── coin-detail.spec.ts
└── settings.spec.ts
```

---

### What to test in E2E

E2E tests are expensive (slow, require a running app, can be flaky). Only test **user journeys** — things that cross multiple components and pages:

| Test                                                | What it covers                             |
| --------------------------------------------------- | ------------------------------------------ |
| Dashboard loads and shows price cards               | useTopCoins → PriceCard render pipeline    |
| Clicking a price card navigates to coin detail      | Router + CoinDetail page                   |
| Markets search filters the coin list                | useCoinSearch → Markets table              |
| Adding a favourite in Settings appears on Dashboard | useFavouriteCoins localStorage persistence |
| Theme toggle persists across page reload            | useTheme localStorage persistence          |

Don't test pure UI states (loading skeletons, hover styles) or anything already covered by unit tests.

---

### Writing an E2E test

```ts
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard shows price cards', async ({ page }) => {
  await page.goto('/dashboard');
  // Wait for at least one price card to appear
  await expect(
    page.locator('[data-testid="price-card"]').first()
  ).toBeVisible();
});

test('clicking a price card navigates to coin detail', async ({ page }) => {
  await page.goto('/dashboard');
  await page.locator('[data-testid="price-card"]').first().click();
  await expect(page).toHaveURL(/\/coin\//);
});
```

**You need `data-testid` attributes on your components for reliable E2E selectors.** Add them as you build:

```tsx
// PriceCard.tsx
<Card data-testid="price-card" ...>
```

Playwright can also use text, roles, and labels — but `data-testid` is the most resilient to UI changes.

---

### Handling live API calls in E2E

Your app calls the real CryptoCompare API. In E2E tests you have two options:

**Option A — let them hit the real API (simplest)**

- Tests need `VITE_CRYPTOCOMPARE_API_KEY` set in the environment
- Tests can be flaky if the API is slow or rate-limited
- Fine for a portfolio project

**Option B — mock with Playwright's network interception**

```ts
test('dashboard loads with mocked data', async ({ page }) => {
  await page.route('**/min-api.cryptocompare.com/**', route => {
    route.fulfill({
      json: {
        /* your fixture data */
      },
    });
  });
  await page.goto('/dashboard');
});
```

Start with Option A. If CI flakiness becomes a problem, switch to Option B.

---

## Part 3 — GitHub Actions CI

### Current state

Your existing `.github/workflows/ci.yml` already runs:

- Lint
- Type check
- `npm run test:coverage` (Vitest unit tests)

You need to **add a second job** for Playwright. Keep them as separate jobs so they run in parallel and you can see failures independently.

### Updated workflow structure

Open `.github/workflows/ci.yml` and add a second job after the existing `test` job:

```yaml
e2e:
  runs-on: ubuntu-latest
  needs: test # only run E2E if unit tests pass
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps chromium

    - name: Run E2E tests
      run: npm run test:e2e
      env:
        VITE_CRYPTOCOMPARE_API_KEY: ${{ secrets.CRYPTOCOMPARE_API_KEY }}

    - name: Upload Playwright report
      uses: actions/upload-artifact@v4
      if: failure() # only upload on failure — saves storage
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 7
```

You'll also need to add `CRYPTOCOMPARE_API_KEY` as a repository secret in GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

---

### Running order in CI

```
push to main
    │
    ├─ job: test
    │   ├─ lint
    │   ├─ type-check
    │   └─ vitest coverage → upload to Codecov
    │
    └─ job: e2e  (runs after test passes)
        └─ playwright chromium
```

---

## Checklist

### Vitest setup (already done — just write tests)

- [x] `vitest.config.ts` configured
- [x] `src/__test__/setup.ts` with DOM mocks
- [x] `test:coverage` script
- [ ] `src/lib/utils.test.ts`
- [ ] `src/lib/local-storage.test.ts`
- [ ] `src/hooks/useFavouriteCoins.test.tsx`
- [ ] `src/components/crypto/PriceCard.test.tsx`
- [ ] `src/components/crypto/PriceChart.test.tsx`

### Playwright setup (not started)

- [ ] `npm install -D @playwright/test`
- [ ] `npx playwright install chromium`
- [ ] Add `test:e2e` scripts to `package.json`
- [ ] Create `playwright.config.ts`
- [ ] Add `data-testid` to key components as you build them
- [ ] `tests/dashboard.spec.ts`
- [ ] `tests/markets.spec.ts`
- [ ] `tests/coin-detail.spec.ts`
- [ ] `tests/settings.spec.ts`

### CI (partially done)

- [x] Unit test job exists
- [ ] Add `e2e` job to `ci.yml`
- [ ] Add `CRYPTOCOMPARE_API_KEY` repository secret in GitHub

---

## Common Pitfalls

**Vitest tests fail because of missing providers**
Wrap components in `QueryClientProvider` (and `RouterProvider` if they use `<Link>`). Create a shared `src/test/utils.tsx` that exports a pre-wrapped `render` function to avoid repeating this in every test file.

**Playwright `webServer` times out**
The `command: 'npm run build && npm run preview'` can be slow first time. Increase `timeout: 120_000` if needed on slow CI runners.

**Tests pass locally, fail on CI**
Usually a missing env variable or timezone difference in date formatting. Check CI logs first — the artifact upload on failure gives you the full Playwright HTML report.

**`vi.mock` not working**
It must be called at the top level of the test file, not inside `describe` or `it`. Vitest hoists `vi.mock` calls automatically, but only from the top scope.
