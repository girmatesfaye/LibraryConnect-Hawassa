import asyncHandler from "express-async-handler";
import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";
import Notification from "../models/notificationModel.js";

/**
 * @desc    Request to borrow a book
 * @route   POST /api/borrow/request
 * @access  Private
 */
const requestBook = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const borrowerId = req.user._id;

  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const ownerId = book.user;

  // 1. Create the borrow request
  const borrowRequest = await Borrow.create({
    book: bookId,
    borrower: borrowerId,
    owner: ownerId,
    status: "pending",
  });

  // 2. Create the notification for the book owner
  const notification = await Notification.create({
    recipient: ownerId,
    sender: borrowerId,
    type: "borrow-request",
    relatedBook: bookId,
    relatedBorrow: borrowRequest._id,
  });

  res.status(201).json(borrowRequest);
});

/**
 * @desc    Get borrow history for the logged-in user
 * @route   GET /api/borrow/history
 * @access  Private
 */
const getBorrowHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all borrow records where the user is either the borrower or the owner
  const borrowHistory = await Borrow.find({
    $or: [{ borrower: userId }, { owner: userId }],
  })
    .populate("book", "title coverImage") // Populate book details
    .populate("borrower", "name profileImage") // Populate borrower details
    .populate("owner", "name profileImage") // Populate owner details
    .sort({ createdAt: -1 });

  res.json(borrowHistory);
});

/**
 * @desc    Update a borrow request status (accept/reject)
 * @route   PUT /api/borrow/:id
 * @access  Private (Book Owner)
 */
const updateBorrowRequest = asyncHandler(async (req, res) => {
  const { status } = req.body; // "Accepted" or "Rejected"
  const borrow = await Borrow.findById(req.params.id);

  if (!borrow) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure the user updating is the book owner
  if (borrow.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this request");
  }

  if (borrow.status !== "Pending") {
    res.status(400);
    throw new Error(`Request already ${borrow.status.toLowerCase()}`);
  }

  borrow.status = status;
  await borrow.save();

  res.json({ message: `Request has been ${status.toLowerCase()}` });
});

export { requestBook, getBorrowHistory, updateBorrowRequest };
