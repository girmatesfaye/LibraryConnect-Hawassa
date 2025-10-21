import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import BrowseHeader from "../components/BrowseHeader";

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      // Fetch conversations
      try {
        setLoading(true);
        const { data } = await API.get("/chat/conversations");
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      // Fetch unread message count for the header
      try {
        const { data } = await API.get("/chat/notifications/unread-count");
        setUnreadMessageCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread message count:", error);
        // Fail silently, not critical for page load
      }
    };

    fetchConversations();
    fetchUnreadCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ProfileHeader unreadCount={unreadMessageCount} showProfileLink={true} /> */}
      <BrowseHeader showNotificationIcon={false} />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Messages</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading conversations...</p>
        ) : conversations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {conversations.map((convo) => (
                <li key={convo._id}>
                  <Link
                    to={`/chat/${convo.user._id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center p-4">
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={
                          convo.user.profileImage?.startsWith("http")
                            ? convo.user.profileImage
                            : `http://localhost:5001/${
                                convo.user.profileImage ||
                                "uploads/images/default-avatar.png"
                              }`
                        }
                        alt={convo.user.name}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-baseline">
                          <p className="text-lg font-semibold text-gray-800">
                            {convo.user.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatRelativeTime(convo.updatedAt)}
                          </p>
                        </div>
                        <p className="text-gray-600 truncate mt-1">
                          {convo.lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            You have no messages yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
