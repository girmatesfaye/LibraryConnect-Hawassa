import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/upload
router.post("/", protect, upload.single("profileImage"), (req, res) => {
  res.send({
    message: "Image uploaded successfully",
    imagePath: `/${req.file.path}`,
  });
});

export default router;
