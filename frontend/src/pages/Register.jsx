import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Handle text and file input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setPhoto(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🔹 Basic client-side validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email address.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.phone.match(/^\+?[0-9]{9,15}$/))
      newErrors.phone = "Enter a valid phone number.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";

    return newErrors;
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("profileImage", photo);

    try {
      const res = await API.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // if backend returns a token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      toast.success("Registration successful!");
      navigate("/profile"); // redirect to profile page
    } catch (err) {
      // if backend returns an error
      toast.error("❌ Registration failed:");
      console.error("❌ Registration failed:", err);
      setErrors({
        api:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* API Error */}
              {errors.api && (
                <div className="text-red-600 text-center bg-red-50 border border-red-200 p-2 rounded">
                  {errors.api}
                </div>
              )}

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
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Phone */}
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
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
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
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Hawassa, Ethiopia"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
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
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-accent"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="photo"
                        type="file"
                        className="sr-only"
                        onChange={handleChange}
                        accept=".jpg,.png,.jpeg"
                      />
                    </label>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {photo && (
                  <div className="mt-3 text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Preview"
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
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
