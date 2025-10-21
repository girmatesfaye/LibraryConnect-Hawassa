import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ProfileHeader from "../components/ProfileHeader";

const AddBook = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    publishedDate: "",
    description: "",
    location: userInfo?.location || "",
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const res = await API.post("/books", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // On success, navigate to the user's profile page.
      // I'm assuming the route is '/profile'.
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* ✅ Background same as Registration/Profile */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      {/* Header */}
      {/* <heteader className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200 bg-white/70 backdrop-blur-md">
        <h1 className="text-xl font-bold text-gray-800">
          LibraryConnect Hawassa
        </h1>
        <nav className="hidden md:flex gap-6 text-gray-600">
          <a href="#" className="hover:text-blue-500">
            Home
          </a>
          <a href="#" className="hover:text-blue-500">
            Explore
          </a>
          <a href="#" className="hover:text-blue-500">
            My Books
          </a>
          <a href="#" className="hover:text-blue-500">
            Community
          </a>
        </nav>
      </heteader> */}

      <ProfileHeader />

      {/* Main Content */}
      <main className="w-full max-w-5xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Add a New Book
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="form-input w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. The Great Gatsby"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-input w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g. Douglas Adams"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select category</option>
                  <option>Fiction</option>
                  <option>Non-fiction</option>
                  <option>Education</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="publishedDate"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Published Date
              </label>
              <input
                id="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={handleChange}
                className="form-input w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-input w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Brief summary of the book..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
              >
                {loading ? "Adding..." : "Add Book"}
              </button>
            </div>
            {message && (
              <p className="text-center mt-4 text-gray-700">{message}</p>
            )}
          </form>
        </div>

        {/* Cover Upload Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Book Cover
          </h3>
          <label
            htmlFor="cover"
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition"
          >
            <span className="text-gray-500">Click or drag to upload cover</span>
            <input
              id="cover"
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {formData.coverImage && (
            <p className="mt-3 text-sm text-gray-600">
              {formData.coverImage.name}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddBook;
