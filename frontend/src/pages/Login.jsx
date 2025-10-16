import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-500">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-600 shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-5"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
