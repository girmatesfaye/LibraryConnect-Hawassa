import express from "express";
import {
  sendMessage,
  getChatHistory,
  getConversations,
} from "../controllers/chatController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Send message
router.post("/send/:receiverId", protect, sendMessage);

// Get chat history between two users
router.get("/:userId", protect, getChatHistory);
// Get Conversation
router.get("/conversations", protect, getConversations);
export default router;
