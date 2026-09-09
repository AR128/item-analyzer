import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./routes/itemRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

// Browser Origin headers are scheme + host only (no trailing slash). Keep the
// production frontend URL in Render's CORS_ALLOWED_ORIGINS environment variable.
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ||
  "https://item-analyzer-three.vercel.app")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header are non-browser clients such as
      // Render health checks, curl, or Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "OPTIONS"],
  }),
);
app.get("/", (req, res) => {
  res.send("Welcome to our Platform!");
});

app.use("/api/items", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
