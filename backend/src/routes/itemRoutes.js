import { Router } from "express";
import multer from "multer";
import { analyseItem } from "../controllers/itemController.js";
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/analyze", upload.single("image"), analyseItem);

export default router;
