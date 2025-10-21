// src/components/ChatInput.jsx
import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="p-4 bg-gray-100 border-t border-gray-200">
      <div className="relative bg-white rounded-full shadow-sm">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-12 px-6 pr-14 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-full text-gray-800 transition-shadow"
        />
        <button
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default ChatInput;
