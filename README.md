# Backend

This folder contains a production-ready Express backend that can be deployed to Render and uses MongoDB for primary storage and Supabase Storage for file/image uploads.

Quick start:

1. Install dependencies

```bash
cd Backend
npm install
```

2. Create a `.env` file from the template

```bash
copy .env.example .env
```

3. Update the `.env` values for:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_BUCKET`
- `FRONTEND_URL`

4. Run locally

```bash
npm run dev
```

### Deployment notes

- `npm start` launches the backend with the environment values from Render.
- When `FAKE_DB_MODE=true`, the backend runs without MongoDB and uses lightweight mocks.
- For production, set `FAKE_DB_MODE=false` and provide a real `MONGODB_URI`.

### Features

- MongoDB-backed authentication with JWT tokens
- Product CRUD with optional Supabase image uploads
- Category management
- Wishlist, cart, order, and message persistence in MongoDB
- Supabase-backed file storage for images

Files updated:
- `package.json` — added `mongoose`, `jsonwebtoken`, `bcryptjs`, and `@supabase/supabase-js`
- `config/database.js` — real MongoDB connection support
- `config/supabase.js` — Supabase storage helper
- `middleware/auth.js` — JWT authentication middleware
- `models/*` — MongoDB models for users, products, categories, carts, wishlist, orders, messages
- `routes/*` — real route handlers using MongoDB and Supabase
