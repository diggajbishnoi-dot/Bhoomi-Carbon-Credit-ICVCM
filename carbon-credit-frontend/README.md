# Bhoomi Carbon — Carbon Credit Price Discovery Frontend

React + Vite + Tailwind + Framer Motion + Chart.js frontend for the Carbon
Credit Price Discovery & Quality Scoring platform, built from the HLD/LLD spec
(Part 5 — the React/Vite/farmer-friendly version).

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
```

The backend (Express + SQLite, already built separately) is expected at
`http://localhost:4000`. Change **one line** in `src/config.js` when you
deploy the backend elsewhere:

```js
export const BACKEND_URL = 'http://localhost:4000'; // -> your deployed URL
```

If the backend isn't running, every page shows a clear "can't reach the
server" state instead of crashing — the UI is safe to open standalone.

## Structure

```
src/
  config.js              BACKEND_URL - the only line to change on deploy
  api.js                 getCredits / postListing / getPriceIndex
  i18n/
    en.json hi.json pa.json mr.json   English, Hindi, Punjabi, Marathi
    i18n.jsx             I18nProvider + useTranslation() hook
  components/
    Layout.jsx           nav, mobile menu, language switcher, footer
    QualityBadge.jsx     tick / warning / cross badge (green/yellow/red)
    StatCounter.jsx      animated count-up stat card
    Reveal.jsx           scroll fade/slide-in wrapper (Framer Motion)
  pages/
    Home.jsx
    WhatIsCarbonCredit.jsx
    MarketPrices.jsx
    BrowseCredits.jsx
    ListCredit.jsx
    Greenwashing.jsx
    PricingExplained.jsx
  App.jsx                 React Router wiring
```

## Notes

- No `localStorage` is used for the language preference (kept in React state)
  so the app is safe to preview anywhere, including sandboxed environments.
  For a real deployment, it's a one-line change to persist the choice —
  see the comment in `src/i18n/i18n.jsx`.
- `GET /credits/:id` doesn't exist on the backend yet, so the listing detail
  modal reads from the already-fetched `GET /credits` list client-side, per
  the LLD's recommended MVP approach.
- Project/registry names are never translated - only UI chrome, per the spec.
- Reduced motion is respected (`prefers-reduced-motion`) in `src/index.css`.
