import asyncHandler from "express-async-handler";
import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";

// @desc Request to borrow a book
// @route POST /api/borrow/:bookId
// @access Private
export const requestBorrow = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (!book.available) {
    res.status(400);
    throw new Error("Book is currently unavailable");
  }

  if (book.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot borrow your own book");
  }

  const existingRequest = await Borrow.findOne({
    book: book._id,
    borrower: req.user._id,
    status: { $in: ["Pending", "Accepted"] },
  });

  if (existingRequest) {
    res.status(400);
    throw new Error(
      "You already have a pending or active request for this book"
    );
  }

  const borrow = await Borrow.create({
    book: book._id,
    owner: book.user,
    borrower: req.user._id,
    message,
  });

  res.status(201).json(borrow);
});

// @desc Get requests for current user (owner)
// @route GET /api/borrow/owner
// @access Private
export const getOwnerRequests = asyncHandler(async (req, res) => {
  const requests = await Borrow.find({ owner: req.user._id })
    .populate("book", "title author coverImage")
    .populate("borrower", "name phone");
  res.json(requests);
});

// @desc Get requests made by current user (borrower)
// @route GET /api/borrow/borrower
// @access Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Borrow.find({ borrower: req.user._id })
    .populate("book", "title author coverImage")
    .populate("owner", "name phone");
  res.json(requests);
});

// @desc Update request status (Accept, Reject, Returned)
// @route PUT /api/borrow/:id
// @access Private (Owner only)

export const updateBorrowStatus = asyncHandler(async (req, res) => {
  const borrow = await Borrow.findById(req.params.id);

  if (!borrow) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  if (borrow.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this request");
  }

  borrow.status = req.body.status || borrow.status;
  await borrow.save();

  res.json({
    success: true,
    message: `Borrow request ${borrow.status.toLowerCase()}`,
    borrow,
    notification: {
      to: borrow.borrower,
      message: `Your borrow request for "${
        borrow.book.title
      }" was ${borrow.status.toLowerCase()}.`,
    },
  });
});

// @desc Get my borrow history (as borrower)
// @route GET /api/borrow/history
// @access Private
export const getBorrowHistory = asyncHandler(async (req, res) => {
  const borrows = await Borrow.find({ borrower: req.user._id })
    .populate("book", "title author coverImage")
    .populate("owner", "name location phone");

  res.json({
    success: true,
    count: borrows.length,
    borrows,
  });
});

// @desc Get all borrow requests for books I own
// @route GET /api/borrow/requests
// @access Private
export const getBorrowRequests = asyncHandler(async (req, res) => {
  const requests = await Borrow.find({ owner: req.user._id })
    .populate("book", "title author coverImage")
    .populate("borrower", "name location phone");

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});
