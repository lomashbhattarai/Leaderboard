# Frontend Regression Tests

This suite protects business behavior before frontend redesign work. Tests intentionally avoid assertions on colors, spacing, CSS classes, or exact layout.

## Unit And Component Coverage

- API client authentication headers and 401 token clearing.
- Auth context login, logout, localStorage restore, protected routes, and admin authorization.
- Earnings calculator localStorage loading, adding, deleting, salary month calculation, and expense subtraction.
- Wealth hook API loading, net worth calculation, mutations, and error states.
- LocalStorage transaction persistence and empty reads.
- Login, navbar, stocks, leaderboard, portfolio, transaction history, wealth tracker, and journals page behavior using mocked API data.

Run:

```bash
npm run test:unit
```

This also writes an HTML report to `test-reports/jest/index.html`, showing the unit/component test files and individual tests that ran.

## Playwright E2E Coverage

The E2E tests run against the CRA dev server and mock backend API calls with `page.route()` so they do not depend on backend database state. By default, the mocked API origin is `http://localhost:3333`, matching the local backend configured in `.env`.

To point the E2E mocks at a different API origin:

```bash
PLAYWRIGHT_API_BASE_URL=http://localhost:3333 npm run test:e2e
```

Covered flows:

- Public home, leaderboard, stocks search, and stock detail navigation.
- Login, logout, protected-route redirects, and admin authorization.
- Portfolio summary, holdings, and transaction history rendering.
- Wealth tracker rendering, create, and delete flows.
- Journals rendering, create, and delete flows.
- Watchlist rendering on the authenticated dashboard.

Run:

```bash
npm run test:e2e
```

This writes Playwright's HTML report to `playwright-report/index.html`, with the project, test file, test name, duration, errors, traces, screenshots, and videos where available. To open the latest report with Playwright:

```bash
npm run test:e2e:report
```

## Full Verification

```bash
npm run test:unit
npm run test:e2e
npm run build
```
