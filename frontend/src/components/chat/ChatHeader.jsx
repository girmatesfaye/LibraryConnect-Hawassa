// src/components/ChatHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

const ChatHeader = ({ recipient }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm z-10 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="text-gray-500 hover:text-bold hover:text-primary transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
            style={{
              backgroundImage: `url(${
                recipient?.profileImage?.startsWith("http")
                  ? recipient.profileImage
                  : `http://localhost:5001/${
                      recipient?.profileImage ||
                      "uploads/images/default-avatar.png"
                    }`
              })`,
            }}
          ></div>
          <h2 className="text-xl font-semibold text-gray-900">
            {recipient ? recipient.name : "Loading..."}
          </h2>
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
        <button className="text-white p-2 rounded-full hover:bg-white/10">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"></path>
          </svg>
        </button>
        <button className="text-white p-2 rounded-full hover:bg-white/10">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div> */}
    </header>
  );
};

export default ChatHeader;
