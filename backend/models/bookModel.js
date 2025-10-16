import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a book title"],
    },
    author: {
      type: String,
      trim: true,
      required: [true, "Please add the author name"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add description"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "Fiction",
        "Non-fiction",
        "Education",
        "Science",
        "History",
        "Other",
      ],
      default: "Other",
    },
    location: { type: String, required: [true, "Please add a location"] },
    coverImage: { type: String, default: "https://via.placeholder.com/150" },
    available: { type: Boolean, default: true },

    // 🧩 Reviews Section
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
