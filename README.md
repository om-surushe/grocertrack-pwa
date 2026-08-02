<div align="center">

# GrocerTrack

A browser-based grocery list for tracking quantities, unit prices, and totals.

[![CI](https://github.com/om-surushe/grocertrack/actions/workflows/ci.yml/badge.svg)](https://github.com/om-surushe/grocertrack/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live demo](https://grocertrack.vercel.app/)

</div>

<p align="center"><img src="./assets/screenshot-light.png" alt="GrocerTrack shopping list" width="400" /></p>

## What it does

- Keeps separate shopping lists in the current browser.
- Calculates price, quantity, or total when the other two values are entered.
- Supports kilograms, litres, and item counts.
- Shows a subtotal for each list.
- Stores lists and theme preference in `localStorage`.
- Follows the system colour scheme and supports manual light/dark switching.

> GrocerTrack has no account or server-side sync. Clearing browser storage removes the saved lists.

## Run locally

Requires Node.js 20 or later.

```bash
git clone https://github.com/om-surushe/grocertrack.git
cd grocertrack
npm ci
npm run dev
```

Vite serves the application at `http://localhost:3000`.

## Validate a change

```bash
npm audit --audit-level=high
npm run typecheck
npm test
npm run build
```

## Stack

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4, compiled during the Vite build
- Browser `localStorage`

## Security

Shopping data stays in the current browser profile. See [SECURITY.md](SECURITY.md) for private vulnerability reporting and local-data limitations.

## License

[MIT](LICENSE) © Om Surushe
