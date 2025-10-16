import express from "express";
import {
  requestBorrow,
  getOwnerRequests,
  getMyRequests,
  updateBorrowStatus,
  getBorrowHistory,
  getBorrowRequests,
} from "../controllers/borrowController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:bookId", protect, requestBorrow);
router.get("/owner", protect, getOwnerRequests);
router.get("/borrower", protect, getMyRequests);
router.put("/:id", protect, updateBorrowStatus);
router.get("/history", protect, getBorrowHistory);
router.get("/requests", protect, getBorrowRequests);
export default router;
