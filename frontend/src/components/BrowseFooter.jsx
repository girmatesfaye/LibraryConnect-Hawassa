import React from "react";

const BrowseFooter = () => {
  return (
    <footer className="mt-20 bg-white/70 backdrop-blur-md border-t border-gray-200 py-6">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} LibraryConnect — Hawassa’s Community
        Library.
      </div>
    </footer>
  );
};

export default BrowseFooter;
