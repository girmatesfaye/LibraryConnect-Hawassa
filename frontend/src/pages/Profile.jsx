import React, { useEffect, useState } from "react";
import API from "../api"; // your axios instance
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBook, FaEnvelope } from "react-icons/fa";
import { IoIosBookmarks } from "react-icons/io";
import ProfileHeader from "../components/ProfileHeader";
import BrowseHeader from "../components/BrowseHeader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [requestsMade, setRequestsMade] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // ✅ Fetch user data and user's books
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", {
            state: { message: "Please login first to view your profile." },
          });
          setLoading(false);
          return;
        }
        const { data } = await API.get("/users/profile");
        setUser(data.user);
        setBooks(data.myBooks);
        setRequestsMade(data.borrowRequestsMade || []);
        setRequestsReceived(data.borrowRequestsReceived || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          navigate("/login");
        } else {
          toast.error("Could not fetch profile data. Please login.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Poll for unread messages
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await API.get("/chat/notifications/unread-count");
        setUnreadMessageCount(data.unreadCount);
      } catch (error) {
        // Fail silently
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const [activeTab, setActiveTab] = useState("my-books");

  const handleRequestUpdate = async (requestId, status) => {
    try {
      await API.put(`/borrow/${requestId}`, { status });
      toast.success(`Request ${status.toLowerCase()}!`);
      setRequestsReceived((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: status } : req
        )
      );
    } catch (error) {
      toast.error("Failed to update request.");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-gray-600">
        <div
          className="absolute inset-0 -z-10 h-full w-full 
          bg-white 
          bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),
               linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
          bg-[size:6rem_4rem]"
        >
          <div
            className="absolute inset-0 
            bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"
          ></div>
        </div>
        Loading profile data...
      </div>
    );
  }

  return (
    <>
      <BrowseHeader unreadCount={unreadMessageCount} showProfileLink={false} />
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10 h-full w-full 
        bg-white 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),
             linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        bg-[size:6rem_4rem]"
        >
          <div
            className="absolute inset-0 
          bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft p-6 space-y-6 sticky top-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div
                      className="w-32 h-32 rounded-full bg-cover bg-center ring-4 ring-blue-500/30"
                      style={{
                        backgroundImage: `url('${
                          user?.profileImage?.startsWith("http")
                            ? user.profileImage
                            : `http://localhost:5001/${
                                user?.profileImage ||
                                "uploads/images/default-avatar.png"
                              }`
                        }')`,
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></span>
                  </div>
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {user?.name || "User Name"}
                    </h1>
                    <p className="text-md text-gray-500">
                      {user?.location || "Unknown location"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaBook className="size-6 text-blue-500" />
                    <p>
                      Owns{" "}
                      <span className="font-semibold text-gray-800">
                        {books.length}
                      </span>{" "}
                      books
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <IoIosBookmarks className="size-6 text-blue-500" />
                    <p>
                      Borrowed{" "}
                      <span className="font-semibold text-gray-800">
                        {user?.borrowedCount || 0}
                      </span>{" "}
                      books
                    </p>
                  </div>
                  <Link
                    to="/chat"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-500"
                  >
                    <FaEnvelope className="size-6 text-blue-500" />
                    <p>
                      <span className="font-semibold text-gray-800">
                        {unreadMessageCount}
                      </span>{" "}
                      unread messages
                    </p>
                  </Link>
                </div>

                <Link
                  to="/add-book"
                  className="block w-full text-center px-6 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 shadow-soft hover:from-blue-700 hover:to-teal-600 transition-all"
                >
                  ADD BOOK
                </Link>
              </div>
            </aside>

            {/* Main */}
            <main className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft">
                <div className="p-6 border-b border-gray-200">
                  <nav className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("my-books")}
                      className={`flex-1 text-center py-3 px-4 rounded-md font-medium text-lg transition-all ${
                        activeTab === "my-books"
                          ? "text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-soft"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      My Books
                    </button>
                    <button
                      // onClick={() => setActiveTab("borrowed-books")}
                      disabled
                      className={`flex-1 text-center py-3 px-4 rounded-md font-medium text-lg transition-all ${
                        activeTab === "borrowed-books"
                          ? "text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-soft"
                          : "text-gray-500 hover:bg-gray-200"
                      } opacity-50 cursor-not-allowed`}
                    >
                      Borrow Requests (Coming Soon)
                    </button>
                  </nav>
                </div>

                {/* Books Grid */}
                <div className="p-6 md:p-8">
                  {activeTab === "my-books" &&
                    (books.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                          <Link to={`/books/${book._id}`} key={book._id}>
                            <div className="group flex flex-col space-y-3">
                              <div className="aspect-[3/4] w-full rounded-lg shadow-2xl overflow-hidden shadow-soft bg-white transition-transform duration-300 group-hover:scale-105">
                                <div
                                  className="w-full h-full bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url('http://localhost:5001/${
                                      book.coverImage ||
                                      "https://via.placeholder.com/150"
                                    }')`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-base font-medium text-gray-800 truncate">
                                {book.title}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">
                        You haven't added any books yet.
                      </p>
                    ))}

                  {activeTab === "borrowed-books" && (
                    <div className="space-y-12">
                      {/* Requests Received */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                          Requests for Your Books
                        </h3>
                        {requestsReceived.length > 0 ? (
                          <div className="space-y-4">
                            {requestsReceived.map((req) => (
                              <div
                                key={req._id}
                                className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold">
                                    {req.borrower.name} requested{" "}
                                    <span className="text-blue-600">
                                      {req.book.title}
                                    </span>
                                  </p>
                                  <p
                                    className={`text-sm font-bold ${
                                      req.status === "Accepted"
                                        ? "text-success"
                                        : req.status === "Rejected"
                                        ? "text-error"
                                        : "text-warning"
                                    }`}
                                  >
                                    Status: {req.status}
                                  </p>
                                </div>
                                {req.status === "Pending" && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleRequestUpdate(req._id, "Accepted")
                                      }
                                      className="btn btn-success btn-sm"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRequestUpdate(req._id, "Rejected")
                                      }
                                      className="btn btn-error btn-sm"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No one has requested your books yet.
                          </p>
                        )}
                      </div>

                      {/* Requests You've Made */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                          Your Borrow Requests
                        </h3>
                        {requestsMade.length > 0 ? (
                          <div className="space-y-4">
                            {requestsMade.map((req) => (
                              <div
                                key={req._id}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <p>
                                  You requested{" "}
                                  <span className="font-semibold text-blue-600">
                                    {req.book.title}
                                  </span>{" "}
                                  from {req.owner.name}
                                </p>
                                <p
                                  className={`text-sm font-bold ${
                                    req.status === "Accepted"
                                      ? "text-success"
                                      : req.status === "Rejected"
                                      ? "text-error"
                                      : "text-warning"
                                  }`}
                                >
                                  Status: {req.status}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            You haven't requested any books yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
