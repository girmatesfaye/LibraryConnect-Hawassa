import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getMyReviews,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.get("/my-reviews", protect, getMyReviews);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
export default router;
