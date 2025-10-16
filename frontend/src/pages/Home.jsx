// import BookCard from "../components/BookCard";

// const dummyBooks = [
//   {
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     category: "Fiction",
//     location: "Hawassa",
//     image: "/books/gatsby.jpg",
//   },
//   {
//     title: "1984",
//     author: "George Orwell",
//     category: "Dystopia",
//     location: "Hawassa",
//     image: "/books/1984.jpg",
//   },
//   {
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     category: "Classic",
//     location: "Hawassa",
//     image: "/books/mockingbird.jpg",
//   },
// ];

// const Home = () => {
//   return (
//     <div className="mt-10">
//       <h2 className="text-3xl font-bold text-[#00B4D8] mb-6 text-center">
//         Featured Books
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {dummyBooks.map((book, index) => (
//           <BookCard key={index} book={book} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import API from "../api";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    sort: "newest",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books", { params: filters }); // assuming backend endpoint is /api/books
        setBooks(res.data || []); // The API returns the array directly
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filters]);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="mt-10 px-4 sm:px-10">
      <h2 className="text-3xl font-bold text-[#00B4D8] mb-6 text-center">
        Explore Books
      </h2>

      {/* 🔍 Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="bg-[#161b22] border border-gray-700 text-white px-4 py-2 rounded-md w-full sm:w-1/3"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="bg-[#161b22] border border-gray-700 text-white px-4 py-2 rounded-md"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Romance">Romance</option>
        </select>
        <select
          className="bg-[#161b22] border border-gray-700 text-white px-4 py-2 rounded-md"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">All Locations</option>
          <option value="Hawassa">Hawassa</option>
          <option value="Addis Ababa">Addis Ababa</option>
          <option value="Jimma">Jimma</option>
        </select>
        <select
          className="bg-[#161b22] border border-gray-700 text-white px-4 py-2 rounded-md"
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      {/* 🧱 Book Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-500">
          No books match your criteria.
        </p>
      )}
    </div>
  );
};

export default Home;
