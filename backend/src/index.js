import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./routes/itemRoutes.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.get("/", (req, res) => {
  res.send("Welcome to our Platform!");
});

app.use("/api/items", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
