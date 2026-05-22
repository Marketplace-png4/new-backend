# Backend (mockable)

This folder contains a minimal Express backend skeleton used for local development. It defaults to `FAKE_DB_MODE=true` so the server runs without a database.

Quick start:

1. Install dependencies

```bash
cd Backend
npm install
```

2. Run in development (uses `nodemon` if installed)

```bash
npm run dev
```

3. By default the wrapper `index.mjs` sets `FAKE_DB_MODE=true`. If you want to use a real MongoDB, set `MONGODB_URI` and unset `FAKE_DB_MODE` in your `.env` file.

Files added:
- `index.mjs` — wrapper to default FAKE_DB_MODE
- `config/database.js` — mock database connector
- `middleware/*` — basic middleware
- `routes/*` — mock route handlers
- `mocks/mockServer.js` — lightweight mock endpoints
