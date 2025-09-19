/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import CartDropdown from "./CartDropdown";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);

  const cartCount = getItemCount();

  // Check if current user is admin
  const isUserAdmin = isAuthenticated && user?.role === "admin";

  // ✅ Helper function to get first name only
  const getFirstName = (fullName) => {
    if (!fullName) return "Dashboard";
    return fullName.split(" ")[0]; // Split by space and take first part
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  // Always go Home, then scroll to #our-story
  const handleGoToOurStory = (e) => {
    e.preventDefault();
    setShowMobileMenu(false);
    navigate("/", { replace: false });
    setTimeout(() => {
      const el = document.getElementById("our-story");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#our-story";
      }
    }, 50);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMobileMenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  return (
    <motion.nav
      className="bg-white shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="ml-3 w-17 h-17 rounded-lg flex items-center justify-center">
              <img src="/Mindy Munchs_Logo-01.png" alt="Mindy Munchs" />
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 ${
                isActive("/") && location.pathname === "/"
                  ? "text-primary-500"
                  : "text-neutral-700"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 ${
                isActive("/products") ? "text-primary-500" : "text-neutral-700"
              }`}
            >
              Products
            </Link>

            <button
              onClick={handleGoToOurStory}
              className="text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 text-neutral-700"
              type="button"
            >
              Our Story
            </button>

            {/* Admin Link - Only show if user is authenticated AND admin */}
            <AnimatePresence>
              {isUserAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/admin"
                    className={`text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 flex items-center gap-2 ${
                      isActive("/admin")
                        ? "text-primary-500"
                        : "text-neutral-700"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Admin</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">
                      👑
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button - Updated: Always accessible, no auth required */}
            <div
              className="relative"
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
            >
              <Link
                to="/cart"
                className={`relative text-base md:text-[17px] font-semibold transition-colors hover:text-primary-500 flex items-center gap-1 ${
                  isActive("/cart") ? "text-primary-500" : "text-neutral-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-10 0V9a2 2 0 012-2h4a2 2 0 012 2v4.1"
                  />
                </svg>
                <span className="hidden lg:inline">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </Link>

              <CartDropdown
                isOpen={showCartDropdown}
                onClose={() => setShowCartDropdown(false)}
              />
            </div>

            {/* User Dashboard Link - Updated: Shows first name only */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-neutral-700 hover:text-primary-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-base md:text-[17px] font-semibold hidden lg:inline">
                    {getFirstName(user?.name)} {/* ✅ Show first name only */}
                  </span>
                  {isUserAdmin && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                </Link>
                <Link to="/">
                  <button
                    onClick={handleLogout}
                    className="text-base md:text-[17px] font-semibold text-neutral-700 hover:text-primary-500 transition-colors"
                  >
                    Logout
                  </button>
                </Link>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-neutral-700 hover:text-primary-500 transition-colors p-2"
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    showMobileMenu
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <img
                        src="/Mindy Munchs_Logo-01.png"
                        alt="Mindy Munchs"
                        className="h-8"
                      />
                    </div>
                    <span className="font-heading text-lg font-bold text-neutral-800">
                      Mindy Munchs
                    </span>
                  </Link>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info (if authenticated) - Updated: Shows first name only */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {getFirstName(user?.name)}{" "}
                          {/* ✅ Show first name only */}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {user?.email || "user@example.com"}
                        </p>
                        {isUserAdmin && (
                          <span className="inline-block text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium mt-1">
                            👑 Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive("/") && location.pathname === "/"
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="font-semibold">Home</span>
                  </Link>

                  <Link
                    to="/products"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive("/products")
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="font-semibold">Products</span>
                  </Link>

                  <button
                    onClick={handleGoToOurStory}
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-50 w-full text-left"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="font-semibold">Our Story</span>
                  </button>

                  {/* Cart - Always visible in mobile menu */}
                  <div className="border-t border-neutral-100 my-4"></div>

                  <Link
                    to="/cart"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive("/cart")
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L3 3H1m6 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-10 0V9a2 2 0 012-2h4a2 2 0 012 2v4.1"
                        />
                      </svg>
                      <span className="font-semibold">Cart</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Authenticated user links */}
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive("/dashboard")
                            ? "bg-primary-50 text-primary-600"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 13-3 3-3-3"
                          />
                        </svg>
                        <span className="font-semibold">Dashboard</span>
                      </Link>

                      {/* Admin Link (Mobile) */}
                      {isUserAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isActive("/admin")
                              ? "bg-primary-50 text-primary-600"
                              : "text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="font-semibold">Admin Panel</span>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                            👑
                          </span>
                        </Link>
                      )}

                      <div className="border-t border-neutral-100 my-4"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-semibold">Logout</span>
                      </button>
                    </>
                  )}

                  {/* Login for non-authenticated users */}
                  {!isAuthenticated && (
                    <>
                      <div className="border-t border-neutral-100 my-4"></div>
                      <Link
                        to="/auth"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 p-3 rounded-lg transition-colors bg-primary-500 text-white hover:bg-primary-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-semibold">Login / Sign Up</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
