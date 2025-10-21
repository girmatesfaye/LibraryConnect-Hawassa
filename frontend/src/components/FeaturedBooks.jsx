import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        // Fetch 4 most recently added books
        const { data } = await API.get("/books?sort=recent&limit=4");
        setBooks(data);
      } catch (error) {
        console.error("Error fetching featured books:", error);
        toast.error("Could not load featured books.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            Recently Added Books
          </h2>
          <p className="mt-4 text-lg font-normal text-gray-600 sm:mt-6 font-pj">
            Discover the latest additions to our community library.
          </p>
        </div>

        {loading ? (
          <p className="text-center mt-8">Loading books...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2"
              >
                <img
                  src={
                    book.coverImage?.startsWith("http")
                      ? book.coverImage
                      : `http://localhost:5001/${
                          book.coverImage || "images/default-book-cover.jpg"
                        }`
                  }
                  alt={book.title}
                  className="w-full h-52 sm:h-56 object-cover"
                />
                <div className="p-4 sm:p-5 flex-grow flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    by {book.author}
                  </p>
                  <div className="mt-3 space-y-2 text-xs sm:text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">Owner:</span>{" "}
                      {book.user?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>{" "}
                      {book.location}
                    </p>
                  </div>
                  <div className="flex-grow" />
                  <Link to={`/books/${book._id}`} className="mt-4">
                    <button className="w-full text-white font-semibold py-2 rounded-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-lg hover:shadow-indigo-300/40 text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;
