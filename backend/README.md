# 🔧 Train Item Checker — Backend

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-2.x-4285F4?logo=google&logoColor=white)

The REST API for Train Item Checker. It receives an uploaded image, identifies the item in it using **Google Gemini Vision**, then looks up the matching railway luggage rule from a **PostgreSQL** database and returns a structured JSON verdict.

---

## 📋 Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | 20 or later |
| PostgreSQL | Any hosted or local instance; connection via `DATABASE_URL` |
| Google Gemini API key | Free-tier key from [Google AI Studio](https://aistudio.google.com/app/apikey) |

---

## 🗂️ Source Layout

```
backend/
├── src/
│   ├── index.js                 ← Express app: CORS, middleware, route mount, server start
│   ├── routes/
│   │   └── itemRoutes.js        ← Declares POST /api/items/analyze with Multer middleware
│   ├── controllers/
│   │   └── itemController.js    ← Orchestrates Gemini → DB lookup → JSON response
│   ├── services/
│   │   ├── geminiService.js     ← Calls Gemini with the image buffer and returns {item, category, confidence}
│   │   └── rulesService.js      ← Queries items/item_aliases/rules tables; normalises item names
│   └── db/
│       ├── index.js             ← Creates pg.Client, connects, and exports the Drizzle instance
│       ├── schema.js            ← Drizzle table definitions: items, item_aliases, rules; statusEnum
│       └── seed.js              ← Seeds initial railway item rules (safe to re-run)
├── drizzle.config.js            ← Drizzle Kit: dialect=postgresql, schema path, credentials
├── .env.example                 ← Copy to .env and fill in your values
└── package.json
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and set the values:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
GEMINI_API_KEY=your_gemini_api_key
# Comma-separated frontend origins. Do not add a trailing slash.
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP listen port. Render injects this automatically. |
| `DATABASE_URL` | **Yes** | — | Full PostgreSQL connection string (supports Neon, Supabase, Railway, etc.). |
| `GEMINI_API_KEY` | **Yes** | — | Server-side Google AI key. Never exposed to the browser. |
| `CORS_ALLOWED_ORIGINS` | Yes in prod | Vercel URL | Comma-separated list of allowed browser origins. No trailing slash. |

> **Multiple origins:** To allow both the production and a preview Vercel URL, use:
> ```env
> CORS_ALLOWED_ORIGINS=https://item-analyzer-three.vercel.app,https://item-analyzer-git-main.vercel.app
> ```

---

## 🚀 Run Locally

```powershell
# Windows PowerShell
npm install
Copy-Item .env.example .env       # then edit .env with your credentials
npm run db:push                   # creates/migrates tables in your PostgreSQL database
npm run seed                      # inserts railway rules (safe to run multiple times)
npm run dev                       # nodemon hot-reload server → http://localhost:5000
```

```bash
# Linux / macOS
npm install
cp .env.example .env
npm run db:push
npm run seed
npm run dev
```

---

## 🌐 API Reference

### `GET /`

Health-check endpoint. Returns a plain text welcome message.

**Response:**
```
200 OK
Welcome to our Platform!
```

---

### `POST /api/items/analyze`

Accepts a `multipart/form-data` request with a single `image` field. Multer buffers the file in memory (max 10 MB). The server identifies the item with Gemini, then queries the database for a matching rule.

**Request:**

```bash
curl -X POST http://localhost:5000/api/items/analyze \
  -F "image=@./bag_with_knife.jpg"
```

**Success response — rule found (`200 OK`):**

```json
{
  "item": "knife",
  "category": "sharp_objects",
  "confidence": 0.97,
  "status": "PROHIBITED",
  "reason": "Sharp bladed items are not permitted on passenger trains for safety reasons.",
  "conditions": null
}
```

**Success response — no rule found (`200 OK`):**

```json
{
  "item": "vintage_typewriter",
  "category": "miscellaneous",
  "confidence": 0.85,
  "status": "UNKNOWN",
  "reason": "No Railway Rule found for this item.",
  "conditions": "No additional conditions available."
}
```

**Error response — missing image (`400 Bad Request`):**

```json
{ "error": "No Image provided" }
```

**Error response — server error (`500 Internal Server Error`):**

```json
{ "message": "<error details>" }
```

#### Status values

| Status | Meaning |
|---|---|
| `ALLOWED` | The item is permitted without restrictions |
| `PROHIBITED` | The item is not allowed on board |
| `CONDITIONAL` | Allowed subject to the conditions described in `conditions` |
| `UNKNOWN` | Item identified but no matching rule exists in the database |

---

## 🗄️ Database Schema

Managed by [Drizzle ORM](https://orm.drizzle.team/). Push changes with `npm run db:push`.

### `items`

| Column | Type | Constraints |
|---|---|---|
| `id` | `serial` | PRIMARY KEY |
| `name` | `varchar(255)` | NOT NULL · UNIQUE (underscore-separated, e.g. `power_bank`) |
| `category` | `varchar(100)` | nullable |

### `item_aliases`

| Column | Type | Constraints |
|---|---|---|
| `id` | `serial` | PRIMARY KEY |
| `item_id` | `integer` | FK → `items.id` · CASCADE DELETE |
| `alias` | `varchar(255)` | NOT NULL · UNIQUE (space-separated synonym, e.g. `"power bank"`) |

### `rules`

| Column | Type | Constraints |
|---|---|---|
| `id` | `serial` | PRIMARY KEY |
| `item_id` | `integer` | FK → `items.id` · CASCADE DELETE |
| `status` | `enum` | NOT NULL — `ALLOWED` \| `PROHIBITED` \| `CONDITIONAL` |
| `reason` | `text` | nullable |
| `conditions` | `text` | nullable (only meaningful when `status = CONDITIONAL`) |

### Lookup logic (`rulesService.js`)

1. Normalise the Gemini-returned item name (trim, lowercase, collapse whitespace).
2. Try a direct match on `items.name` (converting spaces to underscores).
3. If no direct match, try `item_aliases.alias` (space-normalised).
4. Resolve the alias to its parent `items` row, then fetch the `rules` row.
5. Return `null` if no match — the controller sets `status: "UNKNOWN"`.

---

## 🤖 Gemini Integration (`geminiService.js`)

- **Model:** `gemini-3-flash-preview`
- **Input:** raw image buffer encoded as base64 inline data + MIME type
- **Prompt:** instructs the model to identify only the physical object — it does **not** decide railway policy
- **Structured output:** `responseMimeType: "application/json"` with a schema enforcing `{ item: string, category: string, confidence: number }`

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
|---|---|---|
| Development server | `npm run dev` | Starts Express with `nodemon` — auto-restarts on file changes |
| Production server | `npm start` | Runs `node src/index.js` directly |
| Push DB schema | `npm run db:push` | Applies Drizzle schema to the connected PostgreSQL database |
| Drizzle Studio | `npm run db:studio` | Opens a browser-based DB viewer on `http://local.drizzle.studio` |
| Seed data | `npm run seed` | Inserts pre-defined railway item rules into the database |

---

## 🚢 Deploy to Render

1. Create a **Render Web Service** pointing to the `backend/` directory as the root.
2. **Build command:** `npm install`
3. **Start command:** `npm start`
4. Add the following environment variables in Render's dashboard:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your production PostgreSQL connection string |
| `GEMINI_API_KEY` | Your Google AI API key |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL — no trailing slash |

5. Deploy. Copy the resulting Render URL and set it as `VITE_API_BASE_URL` in your Vercel frontend project, then redeploy the frontend.

> ⚠️ `https://site.vercel.app` and `https://site.vercel.app/` are treated as **different** origins by the CORS specification. Always omit the trailing slash.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server framework |
| `@google/genai` | ^2.17.1 | Google Gemini AI SDK |
| `drizzle-orm` | ^0.45.2 | Type-safe ORM for PostgreSQL |
| `pg` | ^8.23.0 | Native PostgreSQL client |
| `multer` | ^2.2.0 | Multipart form-data / file upload handling |
| `cors` | ^2.8.6 | CORS middleware with fine-grained origin control |
| `dotenv` | ^17.4.2 | Loads `.env` into `process.env` |
| `drizzle-kit` *(dev)* | ^0.31.10 | Drizzle schema push and studio |
| `nodemon` *(dev)* | ^3.1.14 | Auto-restart on file changes during development |
