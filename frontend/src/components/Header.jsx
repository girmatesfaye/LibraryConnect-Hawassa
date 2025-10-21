import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-sm">
    <nav className="container mx-auto flex items-center justify-between p-4 px-6">
      <Link to="/" className="flex items-center gap-3">
        <>
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="text-xl font-bold tracking-tight text-text-dark">
            LibraryConnect
          </span>
        </>
      </Link>
      <div className="hidden md:flex items-center gap-4">
        <div className="relative">
          <input
            className="w-64 rounded-full border-none bg-surface-dark py-2 pl-10 pr-4 text-text-dark placeholder-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search books..."
            type="search"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="text-subtle-dark"
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
        </div>
        <Link to="/login">
          <button className="btn-gradient rounded-full px-8 py-3 font-semibold btn btn-outline btn-primary shadow-soft transition-all">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="btn-gradient rounded-full px-8 py-3 font-semibold btn btn-outline btn-primary shadow-soft transition-all">
            Register
          </button>
        </Link>
      </div>
      <button className="md:hidden">
        <svg
          className="h-6 w-6 text-text-dark"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </nav>
  </header>
);

export default Header;
