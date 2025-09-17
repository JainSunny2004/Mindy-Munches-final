/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(''); // 'success' or 'error'

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage('Please enter a valid email address');
      setSubscriptionStatus('error');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          source: 'footer'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptionMessage(data.message);
        setSubscriptionStatus('success');
        setEmail(''); // Clear email input
      } else {
        setSubscriptionMessage(data.message || 'Failed to subscribe');
        setSubscriptionStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionMessage('Network error. Please try again.');
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscriptionMessage('');
        setSubscriptionStatus('');
      }, 5000);
    }
  };

  // More reliable touch device detection using media queries
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;
      setIsTouchDevice(hasCoarsePointer || noHover || isSmallScreen);
    };

    checkTouchDevice();

    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const hoverQuery = window.matchMedia("(hover: none)");
    const screenSizeQuery = window.matchMedia("(max-width: 1023px)");

    coarsePointerQuery.addEventListener('change', checkTouchDevice);
    hoverQuery.addEventListener('change', checkTouchDevice);
    screenSizeQuery.addEventListener('change', checkTouchDevice);

    return () => {
      coarsePointerQuery.removeEventListener('change', checkTouchDevice);
      hoverQuery.removeEventListener('change', checkTouchDevice);
      screenSizeQuery.removeEventListener('change', checkTouchDevice);
    };
  }, []);

  const footerLinks = {
    company: [
      { name: "About Us", href: "/aboutus" },
      { name: "Our Story", href: "/story" },
    ],
    products: [
      { name: "Makhana", href: "/makhana" },
      { name: "Sattu", href: "/sattu" },
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "Returns", href: "/returns" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms and Conditions", href: "/terms-and-conditions" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      iconSvg: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      iconSvg: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      iconSvg: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  // Available on platforms - round logos without hyperlinks
  const availablePlatforms = [
    {
      name: "Blinkit",
      logoSrc: "/blinkit-logo.png",
    },
    {
      name: "Amazon",
      logoSrc: "/amazon-logo.png",
    },
    {
      name: "Flipkart",
      logoSrc: "/flipkart-logo.png",
    },
  ];

  const toggleDropdown = (section) => {
    if (openDropdown === section) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(section);
    }
  };

  const handleClickOutside = () => {
    if (isTouchDevice) {
      setOpenDropdown(null);
    }
  };

  return (
    <footer 
      className="relative bg-gradient-to-b from-amber-50 to-orange-100 pt-16 pb-8 overflow-hidden"
      onClick={handleClickOutside}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-64">
          <img 
            src="/footer-bg.png" 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Newsletter section */}
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Subscribe for special offers, newsletters and become a part of our movement towards traditional Indian superfoods
            </h3>
            
            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your e-mail"
                  disabled={isSubscribing}
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Subscription feedback message */}
            {subscriptionMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                  subscriptionStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {subscriptionMessage}
              </motion.div>
            )}
          </div>
        </div>

        {/* Company info and contact */}
        <div className="text-right mb-8">
          <div className="text-gray-700">
            <p className="font-semibold text-lg">Ghaziabad, Uttar Pradesh</p>
            <p>India</p>
            <p className="mt-2">
              Email ID: 
              <a 
                href="mailto:Mindymunchs@gmail.com" 
                className="text-orange-600 hover:text-orange-700 underline ml-1"
              >
                Mindymunchs@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Social links */}
        <div className="text-left mb-8">
          <p className="text-gray-700 mb-4">Follow us:</p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
                aria-label={social.name}
              >
                {social.iconSvg}
              </a>
            ))}
          </div>
        </div>

        {/* Available on platforms */}
        <div className="text-right mb-12">
          <p className="text-gray-700 mb-4">Available on:</p>
          <div className="flex justify-end space-x-4">
            {availablePlatforms.map((platform) => (
              <div
                key={platform.name}
                className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={platform.logoSrc}
                  alt={platform.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer links with dropdowns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isTouchDevice) {
                    toggleDropdown(section);
                  }
                }}
                onMouseEnter={() => {
                  if (!isTouchDevice) {
                    setOpenDropdown(section);
                  }
                }}
                onMouseLeave={() => {
                  if (!isTouchDevice) {
                    setOpenDropdown(null);
                  }
                }}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-800 uppercase text-sm tracking-wide hover:text-orange-600 transition-colors duration-200"
              >
                {section}
                <motion.svg
                  animate={{ rotate: openDropdown === section ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 lg:hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <motion.ul
                initial={false}
                animate={{
                  height: (openDropdown === section || !isTouchDevice) ? "auto" : 0,
                  opacity: (openDropdown === section || !isTouchDevice) ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {currentYear} Mindy Munchs • Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
