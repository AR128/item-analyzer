# Train Item Checker — Frontend

The React web interface for Train Item Checker. A traveller can upload an image or take one with their camera, then see whether the identified item is allowed, prohibited, conditional, or unknown.

## Requirements

- Node.js 20 or later
- A running instance of the backend API

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`. Vite prints the local URL, normally `http://localhost:5173`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes for deployment | Public URL of the backend, without a trailing slash. |

```env
VITE_API_BASE_URL=https://item-analyzer.onrender.com
```

If it is omitted during local development, the production Render URL is used as a fallback. Set it to `http://localhost:5000` when running the backend locally.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |

## Deploy to Vercel

1. Import the repository into Vercel and choose `frontend` as the root directory.
2. Set `VITE_API_BASE_URL` to the Render backend's public URL.
3. Deploy.
4. Copy the resulting Vercel URL into the backend's `CORS_ALLOWED_ORIGINS` variable, with no trailing slash, then redeploy the backend.

Camera capture requires HTTPS (or `localhost`), which Vercel provides by default.
