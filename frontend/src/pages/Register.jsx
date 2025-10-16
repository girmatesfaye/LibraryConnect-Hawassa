import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
const Register = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    photo: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key !== "confirmPassword") {
          data.append(key, formData[key]);
        }
      }

      const res = await API.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="flex min-h-screen items-stretch font-sans relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]" />
      </div>

      <div className="flex items-center justify-center w-full p-4">
        <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left image */}
          <div className="hidden lg:flex lg:items-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvYZ08WV_Rkn1nUBGmllxnEpO0_iUicuzi5kjuWjIor5Tu30xaCsIJYBudi3a7Jl8DyC2EYQYuGa-ACKtqk-Bg266eVn_cx0yjLBJivMGrEifYWm6R2x_w5sVuPqywQospK9Vf_O9O5QB6BzziWGMqY88X3arLtyqlbBeTiBXqGGyead7xn_9qGxKmWpiMEiYWjnP1ZoC4b_z4pJI4JcjAl9sZ5bnKEI3V-h1px_xIIcmfJ9aguEkx6h6uO76mu-0uf-L3x4hRYwQZ"
              alt="A collection of books on a shelf, symbolizing the library."
              className="w-full h-auto object-contain rounded-xl shadow-soft"
            />
          </div>

          {/* Form section */}
          <div className="bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-soft">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Join LibraryConnect
              </h1>
              <p className="text-gray-600 mt-2">
                Create your account to start sharing and borrowing.
              </p>
              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  />
                </div>
              </div>
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+251..."
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                />
              </div>
              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Hawassa, Ethiopia"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                />
              </div>

              {/* Profile Photo */}
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profile Photo (Optional)
                </label>
                <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary px-6 pt-5 pb-6 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      aria-hidden="true"
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="photo"
                          type="file"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-soft text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-accent hover:text-accent/80"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
