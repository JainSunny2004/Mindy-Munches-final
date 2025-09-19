/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from location state - DEFAULT TO HOME PAGE
  const from = location.state?.from || "/";
  const message = location.state?.message;
  const productName = location.state?.productName;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      } else if (formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to determine redirect URL based on user role only
  const getRedirectUrl = (user, originalFrom) => {
    // Check if user role is admin
    if (user.role === "admin") {
      return "/admin";
    }

    // For regular users, redirect to home page unless coming from specific route
    if (originalFrom && originalFrom !== "/" && originalFrom !== "/dashboard") {
      return originalFrom;
    }

    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      if (isLogin) {
        // Real API login call
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        console.log("Login response:", data); // Debug

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.success && data.data.token) {
          // Store token in localStorage
          localStorage.setItem("token", data.data.token);
          console.log("Token saved:", localStorage.getItem("token")); // Debug

          // Store user data in auth store
          login({
            user: data.data.user,
            token: data.data.token,
          });

          // Determine redirect URL based on user role
          const redirectUrl = getRedirectUrl(data.data.user, from);
          console.log("User role:", data.data.user.role); // Debug
          console.log("Redirecting to:", redirectUrl); // Debug

          // Navigate to appropriate page
          navigate(redirectUrl, { replace: true });

          // Show success notification
          setTimeout(() => {
            const notification = document.createElement("div");
            notification.className =
              "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";

            const isAdmin = data.data.user.role === "admin";

            notification.textContent = isAdmin
              ? "Welcome back, Admin! Redirected to admin panel."
              : message && productName
              ? `Welcome back! You can now add ${productName} to your cart.`
              : "Welcome back! You're now logged in.";

            document.body.appendChild(notification);
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 4000);
          }, 100);
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        // Real API register call
        const response = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        console.log("Register response:", data); // Debug

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        if (data.success && data.data.token) {
          // Store token in localStorage
          localStorage.setItem("token", data.data.token);
          console.log("Token saved:", localStorage.getItem("token")); // Debug

          // Store user data in auth store
          login({
            user: data.data.user,
            token: data.data.token,
          });

          // New users (non-admin) always go to home page
          navigate("/", { replace: true });

          // Show welcome message
          setTimeout(() => {
            const notification = document.createElement("div");
            notification.className =
              "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
            notification.textContent = `Welcome to Mindy Munchs, ${formData.name}! Start exploring our products.`;
            document.body.appendChild(notification);
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 4000);
          }, 100);
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({
        general: error.message || "Authentication failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle forgot password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setErrors({});

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
      setForgotPasswordModalOpen(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl"><img src="/Mindy Munchs_Logo-01.png"></img></span>
              </div>
              
            </Link>

            <h1 className="text-3xl font-heading font-bold text-neutral-800">
              {isLogin ? "Welcome back!" : "Join Mindy Munchs"}
            </h1>
            <p className="text-neutral-600">
              {isLogin
                ? "Sign in to access your account and continue shopping"
                : "Create your account and start exploring our products"}
            </p>
          </div>

          {/* Message from Product Add to Cart or Cart Access */}
          {message && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 "
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center gap-2 text-blue-700">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1 ">
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mb-0">
                    <p className="text-sm font-medium mb-0">{message}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Auth Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8"
            layout
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Name Field (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input-field ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-300"
                            : ""
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-300"
                          : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`input-field pr-10 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-300"
                            : ""
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5 text-neutral-400 hover:text-neutral-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-neutral-400 hover:text-neutral-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input-field ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-300"
                            : ""
                        }`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                 
                </motion.div>
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-primary text-lg py-4 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    onClick={() => setForgotPasswordModalOpen(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>

            {/* Switch Mode */}
            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
              <p className="text-neutral-600 mb-4">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={switchMode}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLogin ? "Create new account" : "Sign in instead"}
              </button>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotPasswordModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setForgotPasswordModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold font-heading mb-4 text-neutral-800">
                Forgot Password?
              </h2>
              <p className="text-neutral-600 mb-6 text-sm">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
