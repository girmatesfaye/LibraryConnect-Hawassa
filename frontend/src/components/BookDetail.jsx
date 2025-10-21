import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BrowseHeader from "./BrowseHeader";

const BookDetails = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Could not load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleRequestBorrow = async () => {
    if (!userInfo) {
      toast.error("Please login or register to request a book.");
      navigate("/login", {
        state: { message: "Please login to request a book." },
      });
      return;
    }
    try {
      await API.post("/borrow/request", { bookId: book._id });
      toast.success("Borrow request sent successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send borrow request.";
      toast.error(errorMessage);
    }
  };

  const handleChatWithOwner = () => {
    if (!userInfo) {
      toast.error("Please login or register to chat with the owner.");
      navigate("/login", {
        state: { message: "Please login to chat with the owner." },
      });
    } else {
      navigate(`/chat/${book.user._id}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-gray-800 bg-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-white 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),
        linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
        bg-[size:6rem_4rem]"
      >
        <div
          className="absolute bottom-0 left-0 right-0 top-0 
          bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"
        ></div>
      </div>

      <BrowseHeader />

      {loading ? (
        <p className="text-center py-20">Loading book details...</p>
      ) : error ? (
        <p className="text-center py-20 text-red-500">{error}</p>
      ) : book ? (
        <main className="container mx-auto px-6 py-12">
          <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg">
                <img
                  src={
                    book.coverImage?.startsWith("http")
                      ? book.coverImage
                      : `http://localhost:5001/${
                          book.coverImage || "images/default-book-cover.jpg"
                        }`
                  }
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col space-y-8 md:col-span-2">
              <div className="rounded-xl bg-white p-8 shadow-md border border-gray-100">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {book.title}
                  </h1>
                  <p className="mt-3 text-lg font-medium text-gray-500">
                    By {book.author} | {book.category}
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-gray-600">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Book Details Section */}
              <div className="rounded-xl bg-white p-8 shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Book Details
                </h2>
                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                    <p className="text-base font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {book.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                    <p className="text-base font-medium text-gray-500">Owner</p>
                    <p className="text-base font-semibold text-gray-800">
                      {book.user?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {book.user?._id !== userInfo?._id && (
                <div className="mt-auto flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    onClick={handleChatWithOwner}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                  >
                    Chat with Owner
                  </button>
                  <button
                    onClick={handleRequestBorrow}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    Request to Borrow
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        <p className="text-center py-20 text-gray-500">Book not found.</p>
      )}

      <Footer />
    </div>
  );
};

export default BookDetails;
