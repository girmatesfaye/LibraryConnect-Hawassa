import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// ✅ Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, recipient: recipientId } = req.body;

  if (!content || !recipientId) {
    res.status(400);
    throw new Error("Invalid data passed into request");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error("Recipient not found");
  }

  let message = await Message.create({
    sender: req.user._id,
    recipient: recipientId, // This is now correct based on the model change
    content,
  });

  // Populate sender and recipient details for the frontend
  message = await message.populate("sender", "name profileImage");
  message = await message.populate("recipient", "name profileImage");

  res.status(201).json(message);
});

// ✅ Get all chat messages between two users
export const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { since } = req.query; // For efficient polling

  const query = {
    $or: [
      { sender: req.user._id, recipient: userId }, // This is now correct
      { sender: userId, recipient: req.user._id }, // This is now correct
    ],
  };

  // When a user opens a chat, mark all messages from the other user as read
  await Message.updateMany(
    { sender: userId, recipient: req.user._id, read: false },
    { $set: { read: true } }
  );

  if (since) {
    query.createdAt = { $gt: new Date(since) };
  }
  const messages = await Message.find(query)
    .sort({ createdAt: 1 })
    .populate("sender", "name profileImage")
    .populate("recipient", "name profileImage");

  const recipient = await User.findById(userId).select("-password");
  if (!recipient) {
    res.status(404);
    throw new Error("Recipient not found");
  }

  res.json({ recipient, messages });
});

// ✅ Get all conversations for logged-in user
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Message.aggregate([
    // 1. Find all messages involving the current user
    { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
    // 2. Sort by most recent first
    { $sort: { createdAt: -1 } },
    // 3. Group by conversation partner
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$sender", userId] },
            then: "$recipient",
            else: "$sender",
          },
        },
        lastMessage: { $first: "$content" },
        updatedAt: { $first: "$createdAt" },
      },
    },
    // 4. Populate the user details for the conversation partner
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    // 5. Deconstruct the user array and format the output
    {
      $unwind: "$user",
    },
    { $project: { "user.password": 0, "user.email": 0 } }, // Exclude sensitive fields
    { $sort: { updatedAt: -1 } },
  ]);
  res.json({ success: true, conversations });
});

/**
 * @desc    Get the count of all unread messages
 * @route   GET /api/chat/notifications/unread-count
 * @access  Private
 */
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const unreadCount = await Message.countDocuments({
    recipient: userId,
    read: false,
  });
  res.json({ unreadCount });
});

/**
 * @desc    Mark messages from a specific user as read
 * @route   PUT /api/chat/mark-as-read/:chatPartnerId
 * @access  Private
 */
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { chatPartnerId } = req.params;
  const userId = req.user._id;

  await Message.updateMany(
    { sender: chatPartnerId, recipient: userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({ message: "Messages marked as read" });
});
