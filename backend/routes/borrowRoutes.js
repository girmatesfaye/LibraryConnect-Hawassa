import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requestBook,
  getBorrowHistory,
  updateBorrowRequest,
} from "../controllers/borrowController.js";

const router = express.Router();

router.post("/request", protect, requestBook);
router.get("/history", protect, getBorrowHistory);
router.put("/:id", protect, updateBorrowRequest);

export default router;
