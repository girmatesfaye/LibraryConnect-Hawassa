import express from "express";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  addBookReview,
} from "../controllers/bookController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(getBooks).post(protect, upload.single("image"), addBook);

router
  .route("/:id")
  .get(getBookById)
  .put(protect, upload.single("image"), updateBook)
  .delete(protect, deleteBook);
router.post("/:id/reviews", protect, addBookReview);
export default router;
