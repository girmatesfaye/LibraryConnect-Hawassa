import asyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";

// @desc   Add new book
// @route  POST /api/books
// @access Private
export const addBook = asyncHandler(async (req, res) => {
  const { title, author, description, category, location } = req.body;

  // Let Mongoose handle validation based on the schema
  const createdBook = await Book.create({
    user: req.user._id,
    title,
    author,
    description,
    category,
    location,
    coverImage: req.file ? `/${req.file.path}` : undefined,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book: createdBook,
  });
});
// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const { search, category, location, sort } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (location) {
    query.location = { $regex: `^${location}$`, $options: "i" };
  }

  let sortOptions = {};
  if (sort === "az") {
    sortOptions.title = 1; // 1 for ascending
  } else {
    sortOptions.createdAt = -1; // -1 for descending (newest)
  }

  const books = await Book.find(query)
    .populate("user", "name phone")
    .sort(sortOptions);

  res.status(200).json(books); // Send the array of books directly
});

// @desc    Get a single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "user",
    "name phone"
  );
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Owner only)
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const { title, author, description, category, location, available } =
    req.body;

  if (book) {
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.description = req.body.description || book.description;
    book.category = req.body.category || book.category;
    book.location = req.body.location || book.location;
    book.available = req.body.available ?? book.available;

    if (req.file) {
      book.coverImage = `/${req.file.path}`;
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Owner only)
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    // Check if the user owns the book
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // In recent Mongoose versions, .remove() is deprecated.
    // Use .deleteOne() on the document or findByIdAndDelete on the model.
    // Using deleteOne() on the instance:
    await book.deleteOne();

    res.json({ message: "Book removed" });
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

// @desc   Search & filter books

// @route  GET /api/books/search
// @access Public
// export const searchBooks = asyncHandler(async (req, res) => {
//   const { search, category, location, sort } = req.query;

//   const query = {};

//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { author: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//     ];
//   }

//   if (category) query.category = category;
//   if (location) query.location = { $regex: location, $options: "i" };

//   if (sort === "newest") {
//     books = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   } else if (sort === "az") {
//     books = books.sort((a, b) => a.title.localeCompare(b.title));
//   }

//   const books = await Book.find(query).populate("user", "name email");

//   if (!books || books.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No books found",
//     });
//   }
//   res.json({
//     success: true,
//     count: books.length,
//     data: books,
//   });
// });

// @desc   Add a review to a book
// @route  POST /api/books/:id/reviews
// @access Private

export const addBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const alreadyReviewed = book.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Book already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  book.reviews.push(review);
  book.numReviews = book.reviews.length;
  book.averageRating =
    book.reviews.reduce((acc, item) => item.rating + acc, 0) /
    book.reviews.length;

  await book.save();
  res.status(201).json({ message: "Review added successfully" });
});
