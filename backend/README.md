# Train Item Checker — Backend

Express API for identifying an uploaded item image with Gemini and matching it to railway rules stored in PostgreSQL.

## Requirements

- Node.js 20 or later
- PostgreSQL database
- Google Gemini API key

## Run locally

```bash
npm install
cp .env.example .env
npm run db:push
npm run seed
npm run dev
```

On Windows PowerShell, replace `cp` with `Copy-Item`. The local server listens on `http://localhost:5000` when `PORT` is not set.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP port. Render supplies this automatically. Defaults to `5000`. |
| `DATABASE_URL` | Yes | PostgreSQL connection string. |
| `GEMINI_API_KEY` | Yes | API key used to identify the uploaded item. |
| `CORS_ALLOWED_ORIGINS` | Yes in production | Comma-separated browser origins allowed to call the API. Do not include a trailing slash. |

```env
CORS_ALLOWED_ORIGINS=https://item-analyzer-three.vercel.app
```

For a Vercel preview deployment, add its exact preview URL as another comma-separated value. Do not use `*` when the API is public.

## API

### `POST /api/items/analyze`

Accepts `multipart/form-data` with one `image` field. The maximum file size is 10 MB.

```bash
curl -X POST http://localhost:5000/api/items/analyze \
  -F "image=@./example.jpg"
```

Successful response:

```json
{
  "item": "battery",
  "category": "electronics",
  "confidence": 0.92,
  "status": "CONDITIONAL",
  "reason": "...",
  "conditions": "..."
}
```

`status` can be `ALLOWED`, `PROHIBITED`, `CONDITIONAL`, or `UNKNOWN`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with nodemon. |
| `npm start` | Start the production server. |
| `npm run db:push` | Apply the Drizzle schema to the database. |
| `npm run db:studio` | Open Drizzle Studio. |
| `npm run seed` | Seed the rule data. |

## Deploy to Render

1. Create a Render Web Service using `backend` as the root directory.
2. Set the build command to `npm install` and start command to `npm start`.
3. Add `DATABASE_URL`, `GEMINI_API_KEY`, and `CORS_ALLOWED_ORIGINS` in Render's environment settings.
4. Deploy, then set the backend's public URL as `VITE_API_BASE_URL` in Vercel.

The CORS origin must exactly match the frontend URL. In particular, `https://site.vercel.app` and `https://site.vercel.app/` are different values for CORS: use the version without the final slash.
