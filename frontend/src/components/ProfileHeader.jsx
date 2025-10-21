import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const ProfileHeader = ({ unreadCount = 0, showProfileLink = true }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <>
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="text-xl font-bold tracking-tight text-text-dark">
                LibraryConnect
              </span>
            </>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className="btn-gradient rounded-full px-6 py-2.5 font-semibold btn btn-outline btn-primary shadow-soft transition-all text-sm"
            >
              Browse Books
            </Link>
            <Link to="/chat" className="relative text-primary hover:text-white">
              <FaBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            {userInfo && showProfileLink && (
              <Link to="/profile">
                <img
                  src={
                    userInfo.profileImage?.startsWith("http")
                      ? userInfo.profileImage
                      : `http://localhost:5001/${
                          userInfo.profileImage ||
                          "uploads/images/default-avatar.png"
                        }`
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-primary hover:shadow-md transition-all"
                  title="View Profile"
                />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
