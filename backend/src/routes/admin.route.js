import { Router } from "express";
import { checkAdmin, createSong, deleteSong } from "../controller/admin.controller.js";
import { uploadFiles } from "../lib/uploads.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);
router.use(uploadFiles);
router.get("/check", checkAdmin);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

export default router;
