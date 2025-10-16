import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#161b22] text-gray-100 p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold text-[#00B4D8]">LibraryConnect</div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link
          to="/"
          className="hover:text-[#00B4D8] transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          to="/books"
          className="hover:text-[#00B4D8] transition-colors duration-300"
        >
          Books
        </Link>
        <Link
          to="/mybooks"
          className="hover:text-[#00B4D8] transition-colors duration-300"
        >
          MyBooks
        </Link>
        <Link
          to="/profile"
          className="hover:text-[#00B4D8] transition-colors duration-300"
        >
          Profile
        </Link>

        {/* Login/Register Buttons */}
        <Link
          to="/login"
          className="ml-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] text-[#0d1117] font-semibold hover:opacity-90 transition-all duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="ml-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#90E0EF] to-[#00B4D8] text-[#0d1117] font-semibold hover:opacity-90 transition-all duration-300"
        >
          Register
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#161b22] flex flex-col items-center md:hidden py-4 space-y-4">
          <Link
            to="/"
            className="hover:text-[#00B4D8]"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/books"
            className="hover:text-[#00B4D8]"
            onClick={() => setIsOpen(false)}
          >
            Books
          </Link>
          <Link
            to="/mybooks"
            className="hover:text-[#00B4D8]"
            onClick={() => setIsOpen(false)}
          >
            MyBooks
          </Link>
          <Link
            to="/profile"
            className="hover:text-[#00B4D8]"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] text-[#0d1117] font-semibold hover:opacity-90 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#90E0EF] to-[#00B4D8] text-[#0d1117] font-semibold hover:opacity-90 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
