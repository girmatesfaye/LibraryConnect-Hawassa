import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";

const BrowseHeader = ({
  showProfileLink = true,
  unreadCount = 0,
  showNotificationIcon = true,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    const user = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    setUserInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="text-xl font-bold tracking-tight text-text-dark">
            LibraryConnect
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-row items-center space-x-4 text-gray-700 font-medium">
          {showNotificationIcon && (
            <Link
              to="/chat"
              className="relative text-primary hover:text-accent"
            >
              <FaBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <Link
            to="/browse"
            className="btn-gradient rounded-full px-6 py-2.5 font-semibold btn btn-outline btn-primary shadow-soft transition-all text-sm"
          >
            Browse Books
          </Link>
          <button
            onClick={handleLogout}
            className="btn-gradient rounded-full px-6 py-2.5 font-semibold btn btn-outline btn-primary shadow-soft transition-all text-sm"
          >
            Logout
          </button>
          {userInfo && showProfileLink && (
            <Link to="/profile">
              <img
                src={
                  userInfo.profileImage?.startsWith("http")
                    ? userInfo.profileImage
                    : `http://localhost:5001/${
                        userInfo.profileImage || "images/default-avatar.png"
                      }`
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-primary shadow-md transition-transform hover:scale-110"
                title="View Profile"
              />
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 text-2xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 pt-4 space-y-4 shadow-md animate-slideDown">
          <Link
            to="/browse"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-2 px-4 text-gray-700 font-medium rounded-md hover:bg-gray-100"
          >
            Browse Books
          </Link>
          {showNotificationIcon && (
            <Link
              to="/chat"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-primary hover:text-accent"
            >
              <FaBell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {userInfo && showProfileLink && (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <img
                src={
                  userInfo.profileImage?.startsWith("http")
                    ? userInfo.profileImage
                    : `http://localhost:5001/${
                        userInfo.profileImage || "images/default-avatar.png"
                      }`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-primary"
              />
              <span className="font-medium text-gray-800">My Profile</span>
            </Link>
          )}

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full btn-gradient rounded-lg py-2.5 font-semibold shadow-soft text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default BrowseHeader;
