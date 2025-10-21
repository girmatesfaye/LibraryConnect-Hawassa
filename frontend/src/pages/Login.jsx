import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";
import API from "../api"; // ✅ adjust the path to where your axios setup file is located

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved email if "Remember Me" was used
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRemember(true);
    }

    // Check for a message from a redirect and show toast
    if (location.state?.message) {
      toast.error(location.state.message);
      navigate(location.pathname, { replace: true }); // Clear the state
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      // ✅ Using your axios instance
      const { data } = await API.post("/users/login", formData);

      // Save user + token
      localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      localStorage.setItem("token", data.token);

      // Remember Me
      if (remember) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/browse");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-stretch font-sans relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]" />
      </div>

      {/* Left image */}
      <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center">
        <img
          src="https://share.google/skIByAoTaQlaU730i"
          alt="Library shelves filled with books."
          className="object-cover w-full h-auto max-h-[80vh] rounded-xl shadow-soft"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4">
        <div className="w-full max-w-md bg-white/50 backdrop-blur-sm rounded-lg shadow-soft p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Login to LibraryConnect
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Access your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="appearance-none rounded-lg w-full px-4 py-3 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="appearance-none rounded-lg w-full px-4 py-3 pr-10 bg-white/70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-accent hover:text-accent/80"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-soft ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-accent hover:text-accent/80"
            >
              Register instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
