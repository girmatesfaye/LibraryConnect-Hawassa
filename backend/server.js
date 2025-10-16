import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// ✅ REST API Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));
// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Socket.io Setup
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  },
});

// 🧠 Active user management
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Register user
  socket.on("setup", (userData) => {
    onlineUsers.set(userData._id, socket.id);
    socket.join(userData._id);
    socket.emit("connected");
    console.log("✅ User joined room:", userData._id);
  });

  // Handle sending message
  socket.on("sendMessage", (message) => {
    const receiverSocket = onlineUsers.get(message.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (let [userId, id] of onlineUsers) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
