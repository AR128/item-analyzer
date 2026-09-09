# 🎨 Train Item Checker — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-8-CA4245?logo=reactrouter&logoColor=white)

The browser client for Train Item Checker. A traveller can upload an image or capture one live with their device camera, then instantly see whether the identified item is **Allowed**, **Prohibited**, **Conditional**, or **Unknown** on a railway journey.

---

## 📋 Requirements

| Requirement | Notes |
|---|---|
| Node.js | 20 or later |
| Running backend API | See [backend/README.md](../backend/README.md) for local setup |

---

## 🗂️ Source Layout

```
frontend/
├── index.html                    ← Vite HTML entry point
├── vite.config.js                ← Vite + React + Babel compiler plugin config
├── eslint.config.js              ← ESLint with React Hooks & React Refresh rules
├── .env.example                  ← Environment variable template
├── package.json
└── src/
    ├── main.jsx                  ← Mounts <App> into #root, wraps with BrowserRouter
    ├── App.jsx                   ← Route declarations (/ → Home, /result → Result)
    ├── App.css                   ← Global stylesheet (design tokens, layout, components)
    ├── pages/
    │   ├── Home.jsx              ← Main page: state management, API call, camera/upload UI
    │   └── Result.jsx            ← Standalone result page (reserved for future deep-link use)
    └── components/
        ├── ImageUploader.jsx     ← Styled <input type="file"> wrapper; triggers handleImage
        ├── CameraCapture.jsx     ← Full-screen react-webcam overlay with capture button
        └── ResultCard.jsx        ← Colour-coded verdict card: icon, label, reason, conditions
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and set the value:

```env
# Set this to your Render service's public URL. Do not add a trailing slash.
VITE_API_BASE_URL=http://localhost:5000
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes (recommended) | Base URL of the backend API. No trailing slash. Falls back to the production Render URL if omitted. |

> The `VITE_` prefix is required by Vite for variables to be accessible inside the browser bundle via `import.meta.env`.

---

## 🚀 Run Locally

```powershell
# Windows PowerShell
npm install
Copy-Item .env.example .env       # then set VITE_API_BASE_URL=http://localhost:5000
npm run dev                       # Vite dev server → http://localhost:5173
```

```bash
# Linux / macOS
npm install
cp .env.example .env
npm run dev
```

Vite will print the local URL. The `--host` flag in `package.json` also exposes the server on your local network so you can test camera capture from a mobile device on the same Wi-Fi.

---

## 🖥️ Pages & Components

### `Home.jsx` — Main Page

The central hub of the application. Manages four pieces of state:

| State | Type | Purpose |
|---|---|---|
| `image` | `File \| null` | The currently selected image file |
| `result` | `object \| null` | The parsed API response |
| `showCamera` | `boolean` | Controls the `CameraCapture` overlay visibility |
| `isProcessing` | `boolean` | Shows the "Analyzing image…" banner during the API call |

**Flow:**
1. User clicks **"Take a photo"** → `CameraCapture` overlay opens.
2. User clicks **"Upload image"** → `ImageUploader` triggers file picker.
3. Either path calls `handleImage(file)` which POSTs to `/api/items/analyze`.
4. On success, `result` is set and `ResultCard` renders.
5. On failure, a fallback `UNKNOWN` result is shown.

---

### `CameraCapture.jsx` — Live Camera

- Uses `react-webcam` to access the device camera via `getUserMedia`.
- Provides a **Capture** button that snapshots the webcam frame as a JPEG Blob/File.
- Exposes `onImageCapture(file)` and `onClose()` callbacks.
- Requires **HTTPS** (or `localhost`) — see security notes below.

---

### `ImageUploader.jsx` — File Upload

- A styled wrapper around `<input type="file">` accepting image MIME types.
- Calls `onImageSelect(file)` with the chosen `File` object.

---

### `ResultCard.jsx` — Verdict Display

Renders the API response as a colour-coded card:

| API `status` | Icon | Label | CSS class |
|---|---|---|---|
| `ALLOWED` | 🟢 | ALLOWED | `.allowed` |
| `PROHIBITED` | 🔴 | NOT ALLOWED | `.prohibited` |
| `CONDITIONAL` | 🟡 | CONDITIONAL | `.conditional` |
| anything else | ⚪ | UNKNOWN | `.unknown` |

Shows the identified item name, reason, and conditions (when present).

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev server | `npm run dev` | Starts Vite with hot module replacement. `--host` exposes it on the LAN. |
| Production build | `npm run build` | Bundles the app into `dist/` for deployment. |
| Preview build | `npm run preview` | Serves the production build locally for final checks. |
| Lint | `npm run lint` | Runs ESLint across all `.jsx` / `.js` files. |

---

## 🚢 Deploy to Vercel

1. Import the repository into Vercel and set **`frontend`** as the **Root Directory**.
2. Vercel will auto-detect Vite and set:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Add the environment variable:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://item-analyzer.onrender.com` (your Render service URL, no trailing slash) |

4. Deploy. Copy the resulting Vercel URL.
5. Paste that URL into the backend's `CORS_ALLOWED_ORIGINS` variable on Render, then **redeploy the backend**.

> 🔁 The order matters: Vercel must be deployed first to obtain its URL, which is then given to the backend CORS config.

---

## 🔐 Security Notes

- **Camera access** (`getUserMedia`) requires a **secure context** — HTTPS or `localhost`. Vercel provides HTTPS by default. If you test from a mobile device over Wi-Fi, use an HTTPS tunnel such as `ngrok`.
- **API key** (`GEMINI_API_KEY`) lives only on the backend server — it is never bundled into the frontend.
- **Image data** is sent to the backend over HTTPS in production and never stored client-side.
- The `VITE_API_BASE_URL` value is embedded in the JS bundle at build time — do not store secrets in frontend env vars.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.8 | UI framework |
| `react-dom` | ^19.2.8 | React DOM renderer |
| `react-router` | ^8.3.0 | Client-side routing |
| `react-webcam` | ^7.2.0 | Camera capture via `getUserMedia` |
| `tailwindcss` | ^4.3.3 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.3.3 | Vite plugin for Tailwind CSS v4 |
| `vite` *(dev)* | ^8.2.0 | Build tool and dev server |
| `@vitejs/plugin-react` *(dev)* | ^6.0.4 | React Fast Refresh + JSX transform |
| `babel-plugin-react-compiler` *(dev)* | ^1.0.0 | Experimental React Compiler optimisations |
| `eslint` *(dev)* | ^10.8.0 | JavaScript linter |
| `eslint-plugin-react-hooks` *(dev)* | ^7.1.1 | Enforces Rules of Hooks |
| `eslint-plugin-react-refresh` *(dev)* | ^0.5.3 | Validates Fast Refresh compatibility |
