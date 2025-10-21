import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import FeaturedBooks from "../components/FeaturedBooks";
import Footer from "../components/Footer";
import BrowseHeader from "../components/BrowseHeader"; // Import BrowseHeader
import API from "../api"; // Import API for fetching unread messages
import toast from "react-hot-toast"; // Import toast for error messages

const LandingPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true); // New state for loading user info

  useEffect(() => {
    const fetchUserInfoAndUnreadCount = async () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);

        // Fetch unread message count if user is logged in
        try {
          const { data } = await API.get("/chat/notifications/unread-count");
          setUnreadMessageCount(data.unreadCount);
        } catch (error) {
          console.error("Error fetching unread message count:", error);
          // Fail silently or show a subtle error
        }
      }
      setLoadingUserInfo(false); // User info loading is complete
    };

    fetchUserInfoAndUnreadCount();

    // Poll for unread messages if user is logged in
    const intervalId = setInterval(() => {
      if (localStorage.getItem("userInfo")) {
        // Check again in case user logged out
        fetchUserInfoAndUnreadCount();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Show a loading state for the header if user info is still being determined
  if (loadingUserInfo) {
    return (
      <div className="relative min-h-screen w-full font-sans text-text-dark bg-background-dark">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10 h-full w-full 
          bg-white 
          bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
          bg-[size:6rem_4rem]"
        >
          <div
            className="absolute inset-0 
            bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"
          ></div>
        </div>
        {/* A simple placeholder or spinner while loading */}
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full font-sans text-text-dark  bg-background-dark">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full 
        bg-white 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        bg-[size:6rem_4rem]"
      >
        <div
          className="absolute inset-0 
          bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"
        ></div>
      </div>

      {/* Page sections */}
      {userInfo ? (
        <BrowseHeader unreadCount={unreadMessageCount} />
      ) : (
        <Header />
      )}
      <main className="flex-grow">
        <Hero userInfo={userInfo} /> {/* Pass userInfo to Hero */}
        <Welcome />
        <FeaturedBooks />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
