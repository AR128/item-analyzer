# 🚆 Train Item Checker

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-2.x-4285F4?logo=google&logoColor=white)

A full-stack AI-powered web application that helps railway travellers instantly check whether an item is permitted in train luggage. The user uploads or captures a photo of an item; Google Gemini identifies it; the backend matches it against a curated database of Indian Railways luggage rules; and the frontend renders a clear **ALLOWED / PROHIBITED / CONDITIONAL / UNKNOWN** verdict.

---

## ✨ Features

- 📸 **Live camera capture** — take a photo directly in the browser (requires HTTPS or localhost)
- 🖼️ **File upload** — browse or select any image from disk
- 🤖 **AI item identification** — Google Gemini Vision identifies the object with a confidence score
- 🗄️ **Rules database** — PostgreSQL table of pre-seeded railway rules for dozens of item categories
- 🔍 **Alias matching** — common synonyms (e.g. "laptop" → "notebook computer") resolved automatically
- 🟢🔴🟡 **Colour-coded verdict** — instant status with reason and conditions when applicable
- 🌐 **Production-ready** — backend on Render, frontend on Vercel with proper CORS configuration

---

## 🗂️ Repository Layout

```
day 10/
├── README.md                      ← Monorepo overview (this file)
├── backend/                       ← Express API + Drizzle ORM + PostgreSQL
│   ├── src/
│   │   ├── index.js               ← Server entry point, CORS & middleware setup
│   │   ├── routes/
│   │   │   └── itemRoutes.js      ← POST /api/items/analyze route declaration
│   │   ├── controllers/
│   │   │   └── itemController.js  ← Request handler & JSON response builder
│   │   ├── services/
│   │   │   ├── geminiService.js   ← Google Gemini Vision integration
│   │   │   └── rulesService.js    ← DB lookup with alias fallback logic
│   │   └── db/
│   │       ├── index.js           ← PostgreSQL client + Drizzle instance
│   │       ├── schema.js          ← Table & enum definitions (Drizzle)
│   │       └── seed.js            ← Seed data: railway item rules
│   ├── drizzle.config.js          ← Drizzle Kit dialect + credentials config
│   ├── .env.example               ← Environment variable template
│   ├── package.json
│   └── README.md                  ← Backend-specific setup & deployment guide
└── frontend/                      ← React 19 + Vite 8 + Tailwind CSS 4
    ├── src/
    │   ├── main.jsx               ← React entry point, router bootstrap
    │   ├── App.jsx                ← Root component with route definitions
    │   ├── App.css                ← Global stylesheet
    │   ├── pages/
    │   │   ├── Home.jsx           ← Main page: upload, camera trigger, result display
    │   │   └── Result.jsx         ← Standalone result page (reserved for deep-link)
    │   └── components/
    │       ├── ImageUploader.jsx  ← Styled file-input wrapper
    │       ├── CameraCapture.jsx  ← react-webcam live camera UI with capture
    │       └── ResultCard.jsx     ← Colour-coded verdict card (icon + reason + conditions)
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── .env.example
    ├── package.json
    └── README.md                  ← Frontend-specific setup & deployment guide
```

---

## 🔄 How It Works — Request Lifecycle

```
Browser
  │
  │  1. User selects a file or opens the live camera
  ▼
Home.jsx
  │
  │  2. POST /api/items/analyze  (multipart/form-data, field name: "image")
  ▼
itemController.js
  │
  │  3. Passes image buffer + MIME type to Gemini
  ▼
geminiService.js  ──►  Google Gemini API (gemini-3-flash-preview)
  │                    Returns JSON: { item, category, confidence }
  │
  │  4. Looks up the identified item in the database
  ▼
rulesService.js
  │   ├─ Direct match on items.name  (underscore-normalised)
  │   └─ Alias fallback via item_aliases table (space-normalised)
  │
  ▼
PostgreSQL  (rules table)
  │   Returns { status, reason, conditions }
  │
  │  5. JSON response sent back to the browser
  ▼
ResultCard.jsx
     ALLOWED 🟢  |  PROHIBITED 🔴  |  CONDITIONAL 🟡  |  UNKNOWN ⚪
```

---

## 🚀 Quick Start — Local Development

You need **two terminals** open simultaneously.

### Terminal 1 — Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env        # fill in DATABASE_URL and GEMINI_API_KEY
npm run db:push                    # push schema to your PostgreSQL database
npm run seed                       # populate railway rules (idempotent)
npm run dev                        # hot-reload server on http://localhost:5000
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env        # set VITE_API_BASE_URL=http://localhost:5000
npm run dev                        # Vite dev server on http://localhost:5173
```

> On Linux / macOS replace `Copy-Item` with `cp`.

### Minimum required `.env` values

| File | Variable | Example |
|---|---|---|
| `backend/.env` | `DATABASE_URL` | `postgresql://user:pass@localhost:5432/traindb` |
| `backend/.env` | `GEMINI_API_KEY` | `AIzaSy...` |
| `backend/.env` | `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |
| `frontend/.env` | `VITE_API_BASE_URL` | `http://localhost:5000` |

---

## 🗄️ Database Schema

Three tables are created by `npm run db:push` and managed by Drizzle ORM.

### `items`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `serial` | PRIMARY KEY | Auto-increment identifier |
| `name` | `varchar(255)` | NOT NULL, UNIQUE | Underscore-separated key, e.g. `power_bank` |
| `category` | `varchar(100)` | | e.g. `electronics`, `flammables`, `liquids` |

### `item_aliases`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `serial` | PRIMARY KEY | |
| `item_id` | `integer` | FK → `items.id` (CASCADE DELETE) | Parent item |
| `alias` | `varchar(255)` | NOT NULL, UNIQUE | Human synonym, e.g. `"laptop"` |

### `rules`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `serial` | PRIMARY KEY | |
| `item_id` | `integer` | FK → `items.id` (CASCADE DELETE) | Item this rule applies to |
| `status` | `enum` | NOT NULL | One of `ALLOWED`, `PROHIBITED`, `CONDITIONAL` |
| `reason` | `text` | | Human-readable policy explanation |
| `conditions` | `text` | | Additional travel conditions (populated for `CONDITIONAL`) |

---

## 🌍 Production Deployment

| Service | Directory | Recommended platform |
|---|---|---|
| REST API | `backend/` | [Render](https://render.com) |
| React web app | `frontend/` | [Vercel](https://vercel.com) |

### Cross-origin configuration

Both services must know each other's URLs before first deployment:

| Platform | Environment variable | Value |
|---|---|---|
| Render | `CORS_ALLOWED_ORIGINS` | `https://item-analyzer-three.vercel.app` |
| Vercel | `VITE_API_BASE_URL` | `https://item-analyzer.onrender.com` |

> ⚠️ Neither value should end with `/`. `https://site.vercel.app` and `https://site.vercel.app/` are treated as **different** origins by CORS.

After changing any environment variable, **redeploy** the affected service.

Full step-by-step platform instructions:
- [Backend deployment guide → backend/README.md](./backend/README.md)
- [Frontend deployment guide → frontend/README.md](./frontend/README.md)

---

## 🔐 Security Notes

- **Never commit `.env` files**, database credentials, or API keys. Both `.env` files are listed in `.gitignore`.
- Keep `CORS_ALLOWED_ORIGINS` restricted to domains you control — never use `*` for a public API.
- Camera access (`getUserMedia`) requires **HTTPS** outside of `localhost`. Vercel provides HTTPS automatically.
- Images are processed in-memory via Multer `memoryStorage` — they are never written to disk on the server.
- `GEMINI_API_KEY` is server-side only and is never exposed to the browser.

---

## 🛠️ Full Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Frontend build tool | Vite | 8 |
| Frontend styling | Tailwind CSS | 4 |
| Camera integration | react-webcam | 7 |
| Client-side routing | React Router | 8 |
| Backend framework | Express | 5 |
| AI Vision model | Google Gemini (`@google/genai`) | 2 |
| ORM | Drizzle ORM | 0.45 |
| ORM migration tool | Drizzle Kit | 0.31 |
| Database | PostgreSQL | 16+ |
| PostgreSQL driver | `pg` (node-postgres) | 8 |
| File uploads | Multer | 2 |
| Environment config | dotenv | 17 |
| Dev auto-reload | nodemon | 3 |
