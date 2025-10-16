import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// ✅ Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Message content is required");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error("Receiver not found");
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  res.status(201).json({
    success: true,
    message,
  });
});

// ✅ Get all chat messages between two users
export const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name profilePic")
    .populate("receiver", "name profilePic");

  res.json({ success: true, messages });
});

// ✅ Get all conversations for logged-in user
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name profilePic")
    .populate("receiver", "name profilePic")
    .sort({ updatedAt: -1 });

  // Group conversations by other user
  const conversationsMap = new Map();

  messages.forEach((msg) => {
    const otherUser =
      msg.sender._id.toString() === userId.toString()
        ? msg.receiver
        : msg.sender;

    if (!conversationsMap.has(otherUser._id.toString())) {
      conversationsMap.set(otherUser._id.toString(), {
        _id: otherUser._id,
        user: otherUser,
        lastMessage: msg.content,
        updatedAt: msg.updatedAt,
      });
    }
  });

  const conversations = Array.from(conversationsMap.values());
  res.json({ success: true, conversations });
});
