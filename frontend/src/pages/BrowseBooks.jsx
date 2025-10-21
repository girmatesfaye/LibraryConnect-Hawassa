import React, { useEffect, useState } from "react";
import BrowseHeader from "../components/BrowseHeader";
import BrowseFooter from "../components/BrowseFooter";
import API from "../api";
import { Link } from "react-router-dom";

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
        if (genre !== "All") params.append("category", genre);
        if (sort !== "relevance") params.append("sort", sort);

        const res = await API.get(`/books?${params.toString()}`);
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      }
      setLoading(false);
    };
    fetchBooks();
  }, [debouncedSearchQuery, genre, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-inter">
      <BrowseHeader />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-16 py-6 sm:py-8 md:py-12">
        {/* Search Bar and Filters */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-soft border border-gray-100 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative md:col-span-2">
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 text-gray-400">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:col-span-1">
              <div className="relative">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-lg py-2.5 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm sm:text-base"
                >
                  <option value="All">Genre: All</option>
                  <option>Fiction</option>
                  <option>Non-fiction</option>
                  <option>Education</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Other</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none text-gray-400">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-lg py-2.5 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm sm:text-base"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="title-az">Title A-Z</option>
                  <option value="author-az">Author A-Z</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none text-gray-400">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Loading books...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 text-sm sm:text-base">
            {error}
          </p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
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
                <div className="p-4 sm:p-6 flex-grow flex flex-col space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Uploaded by: {book.user?.name || "Unknown"}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mt-1">
                      {book.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <span className="material-symbols-outlined text-sm sm:text-base mr-1 sm:mr-2 text-gray-400">
                      location_on
                    </span>
                    <span>{book.location}</span>
                  </div>
                  <div className="flex-grow" />
                  <Link to={`/books/${book._id}`}>
                    <button className="w-full text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-300 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-lg hover:shadow-indigo-300/40 text-sm sm:text-base">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No books found. Try adjusting your search or filters.
          </p>
        )}
      </main>

      <BrowseFooter />
    </div>
  );
};

export default BrowseBooks;
