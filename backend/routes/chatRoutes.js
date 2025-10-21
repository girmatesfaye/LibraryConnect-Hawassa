import express from "express";
import {
  sendMessage,
  getChatHistory,
  getConversations,
  getUnreadMessageCount,
  markMessagesAsRead,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Send message
router.post("/", protect, sendMessage);

// Get all conversations for the logged-in user (must be before /:userId)
router.get("/conversations", protect, getConversations);

// Get unread message count for notifications
router.get("/notifications/unread-count", protect, getUnreadMessageCount);

// Mark messages in a conversation as read
router.put("/mark-as-read/:chatPartnerId", protect, markMessagesAsRead);

// Get chat history between two users
router.get("/:userId", protect, getChatHistory);
export default router;
