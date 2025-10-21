import React from "react";

const Footer = () => (
  <footer className="bg-surface-dark shadow-soft">
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="text-xl font-bold tracking-tight text-text-dark">
            LibraryConnect
          </span>
        </div>

        {/* Copyright */}
        <p className="text-sm text-subtle-dark">
          © 2024 LibraryConnect Hawassa. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            aria-label="Facebook"
            className="text-subtle-dark transition-colors hover:text-secondary"
            href="#"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
            </svg>
          </a>
          <a
            aria-label="Twitter"
            className="text-subtle-dark transition-colors hover:text-secondary"
            href="#"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.7 1.03-.78-.84-1.9-1.36-3.13-1.36-2.38 0-4.3 1.92-4.3 4.3 0 .34.04.67.11.98-3.57-.18-6.73-1.89-8.85-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.7-.02-1.36-.22-1.94-.54v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.92 6.58 1.92 7.9 0 12.22-6.55 12.22-12.22 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z"></path>
            </svg>
          </a>
          <a
            aria-label="Instagram"
            className="text-subtle-dark transition-colors hover:text-secondary"
            href="#"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.486.01-4.704.068-2.61.12-3.832 1.34-3.951 3.951-.058 1.218-.068 1.588-.068 4.704s.01 3.486.068 4.704c.12 2.61 1.34 3.833 3.951 3.951 1.218.058 1.588.068 4.704.068s3.486-.01 4.704-.068c2.61-.12 3.832-1.34 3.951-3.951.058-1.218.068-1.588.068-4.704s-.01-3.486-.068-4.704c-.12-2.61-1.34-3.832-3.951-3.951-.058-1.218-.068-1.588-.068-4.704zm0 2.882c-1.956 0-3.541 1.585-3.541 3.541s1.585 3.541 3.541 3.541 3.541-1.585 3.541-3.541S13.956 6.847 12 6.847zm0 5.719c-1.2 0-2.178-.978-2.178-2.178s.978-2.178 2.178-2.178 2.178.978 2.178 2.178-.978 2.178-2.178 2.178zM18.802 6.116c-.596 0-1.078.482-1.078 1.078s.482 1.078 1.078 1.078 1.078-.482 1.078-1.078-.482-1.078-1.078-1.078z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
