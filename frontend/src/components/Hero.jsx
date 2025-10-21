import React from "react";
import { Link } from "react-router-dom";

const Hero = ({ userInfo }) => (
  <section className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 md:min-h-[70vh] bg-hero-gradient">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-primary md:text-6xl">
        Share. Discover. Connect.
      </h1>
      <p className="mt-4 text-lg text-text-dark md:text-xl">
        Hawassa’s Community Library Awaits You.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {userInfo ? (
          // If user is logged in, show a "Browse Books" button or similar
          <Link to="/browse">
            <button className="btn-gradient rounded-full px-8 py-3 font-semibold btn btn-outline btn-primary shadow-soft transition-all">
              Browse Books
            </button>
          </Link>
        ) : (
          // If user is not logged in, show Login and Register buttons
          <>
            <Link to="/login">
              <button className="btn-gradient rounded-full px-8 py-3 font-semibold btn btn-outline btn-primary shadow-soft transition-all">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-gradient rounded-full px-8 py-3 font-semibold btn btn-outline btn-primary shadow-soft transition-all ">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  </section>
);

export default Hero;
