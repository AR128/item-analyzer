# Train Item Checker

A full-stack application that checks a photographed item against railway luggage rules. The frontend identifies the item from an image, then presents a clear status and any conditions that apply.

## Project structure

| Directory | Description |
| --- | --- |
| [`frontend/`](./frontend) | React + Vite application, deployed on Vercel. |
| [`backend/`](./backend) | Express API, Gemini integration, Drizzle, and PostgreSQL rules data; deployed on Render. |

See the individual READMEs for setup details:

- [Frontend setup](./frontend/README.md)
- [Backend setup](./backend/README.md)

## How it works

1. The user uploads or captures an image in the React app.
2. The frontend sends it to `POST /api/items/analyze` as multipart form data.
3. The backend uses Gemini to identify the visible item.
4. The backend finds the matching rule and returns the item status, reason, and conditions.
5. The frontend displays `ALLOWED`, `PROHIBITED`, `CONDITIONAL`, or `UNKNOWN`.

## Local development

Open two terminals from the repository root:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:push
npm run seed
npm run dev
```

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

In `frontend/.env`, use this local API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

In `backend/.env`, make sure the CORS list permits the Vite development server:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Production deployment

Deploy `backend/` to Render and `frontend/` to Vercel. Configure the two URLs so they can communicate:

| Platform | Variable | Value |
| --- | --- | --- |
| Render | `CORS_ALLOWED_ORIGINS` | The exact Vercel URL, e.g. `https://item-analyzer-three.vercel.app` |
| Vercel | `VITE_API_BASE_URL` | The exact Render URL, e.g. `https://item-analyzer.onrender.com` |

Neither value should end with `/`. After changing an environment variable, redeploy the relevant service.

## Security notes

- Never commit `.env` files, database credentials, or Gemini API keys.
- Keep `CORS_ALLOWED_ORIGINS` restricted to frontend domains you control.
- Use HTTPS in production; camera access needs HTTPS outside localhost.
