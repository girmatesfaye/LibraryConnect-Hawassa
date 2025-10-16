import crypto from "crypto";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  const { name, email, phone, password, location, profilePic } = req.body;
  const uploadedImage = req.file?.path; // from Cloudinary

  if (!name || !email || !phone || !password || !location) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Prefer uploaded image; fallback to profilePic URL; else default avatar
    const profileImage =
      uploadedImage ||
      profilePic ||
      "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png";

    const user = await User.create({
      name,
      email,
      phone,
      password,
      location,
      profileImage,
    });
    res.status(201).json({
      userInfo: user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const myBooks = await Book.find({ user: req.user._id });
  res.json({ success: true, user, myBooks });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `
  <div style="
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f9fafb;
    padding: 30px;
    color: #111827;
    line-height: 1.6;
  ">
    <div style="
      max-width: 500px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 30px;
    ">
      <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You recently requested to reset your password. Click the button below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" target="_blank" style="
          background-color: #4F46E5;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
        ">Reset Password</a>
      </div>
      
      <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">
        <a href="${resetUrl}" target="_blank" style="color: #4F46E5;">${resetUrl}</a>
      </p>
      
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        © ${new Date().getFullYear()} LibraryConnect Hawassa. All rights reserved.
      </p>
    </div>
  </div>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.json({ success: true, message: "Reset email sent successfully" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Email sending error:", error); // Log the original error
    res.status(500);
    // Pass a more informative error message
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Email could not be sent"
        : `Email could not be sent: ${error.message}`;
    throw new Error(errorMessage);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.email = req.body.email || user.email;
    user.profilePic = req.body.profilePic || user.profilePic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profilePic: updatedUser.profilePic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Get all reviews written by the logged-in user
// @route  GET /api/users/my-reviews
// @access Private
export const getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all books that contain reviews by this user
  const books = await Book.find({ "reviews.user": userId });

  // Extract only the user's reviews from those books
  const myReviews = [];

  books.forEach((book) => {
    const userReviews = book.reviews
      .filter((r) => r.user.toString() === userId.toString())
      .map((r) => ({
        bookId: book._id,
        bookTitle: book.title,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));

    myReviews.push(...userReviews);
  });

  res.json({
    success: true,
    count: myReviews.length,
    reviews: myReviews,
  });
});
