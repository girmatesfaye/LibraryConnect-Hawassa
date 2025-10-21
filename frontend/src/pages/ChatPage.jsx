// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";

const ChatPage = () => {
  const { recipientId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setCurrentUser(userInfo);

    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/chat/${recipientId}`);
        setRecipient(data.recipient);
        // This will now be the single source of truth for messages
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [recipientId]);

  // 2. Separate effect for polling for *new* messages
  useEffect(() => {
    // Set up polling to fetch messages periodically
    const intervalId = setInterval(async () => {
      try {
        const { data } = await API.get(`/chat/${recipientId}`);
        // Only update if there are new messages to avoid re-renders
        setMessages((prevMessages) =>
          JSON.stringify(prevMessages) !== JSON.stringify(data.messages)
            ? data.messages
            : prevMessages
        );
      } catch (error) {
        console.error("Polling for new messages failed", error);
      }
    }, 3000); // Poll every 3 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, [recipientId, messages]); // Re-run if messages array changes

  // --- Scroll to bottom when new messages arrive ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || !currentUser || !recipient) return;

    // Optimistic update: add message to UI immediately
    const optimisticMessage = {
      _id: `temp-${Date.now()}`, // Temporary ID
      sender: currentUser, // Use the full user object
      recipient: recipient,
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    const messageData = {
      sender: currentUser._id,
      recipient: recipient._id,
      content: messageContent,
    };

    try {
      // Send message to backend. The polling will pick up the saved message.
      await API.post("/chat", messageData);
    } catch (error) {
      console.error("Failed to send message", error);
      // Optional: handle failed message, e.g., remove optimistic message
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-display bg-gray-100 text-gray-800">
      {/* Background */}

      {/* Use a simpler, more modern header */}
      <ChatHeader recipient={recipient} />

      <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender._id === currentUser._id;
          const sender = isMe ? currentUser : msg.sender;
          return (
            <ChatMessage
              key={msg._id}
              message={msg.content}
              time={`${sender.name} • ${new Date(
                msg.createdAt
              ).toLocaleTimeString()}`}
              isMe={isMe}
              avatar={sender.profileImage}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
