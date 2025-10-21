// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message, time, isMe, avatar }) => {
  const avatarUrl = avatar?.startsWith("http")
    ? avatar
    : `http://localhost:5001/${avatar || "uploads/images/default-avatar.png"}`;

  return (
    <div
      className={`flex items-end gap-3 w-full ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      {!isMe && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        ></div>
      )}
      <div
        className={`flex flex-col gap-1 max-w-lg ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isMe
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-lg"
              : "bg-white text-gray-700 rounded-bl-lg"
          }`}
        >
          <p className="text-base leading-relaxed">{message}</p>
        </div>
        <p className="text-xs text-gray-400 px-1">{time}</p>
      </div>
      {isMe && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        ></div>
      )}
    </div>
  );
};

export default ChatMessage;
