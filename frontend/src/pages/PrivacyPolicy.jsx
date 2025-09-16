import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center animate-slide-up">
            <h1 className="font-brand text-4xl md:text-5xl font-bold text-secondary-700 mb-4">
              🔒 Privacy Policy
            </h1>
            <p className="text-lg text-neutral-600 font-accent max-w-2xl mx-auto">
              At <span className="font-brand font-semibold text-primary-700">Mindy Munchs</span>, 
              we respect your privacy and are committed to protecting your personal data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Information We Collect */}
          <div className="card card-makhana p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-secondary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              Information We Collect
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                <span><span className="font-semibold">Personal Details:</span> Name, email, phone number, and delivery address for order processing.</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                <span><span className="font-semibold">Payment Information:</span> Payment details (securely handled via payment gateways).</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                <span><span className="font-semibold">Website Usage:</span> Browsing behavior on our site (cookies, analytics).</span>
              </li>
            </ul>
          </div>

          {/* How We Use It */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              How We Use It
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                To process orders and deliver products.
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                To improve our website and customer experience.
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                To send you updates, offers, and promotions <span className="text-sm text-neutral-500">&nbsp;(you may opt out anytime)</span>.
              </li>
            </ul>
          </div>

          {/* Data Protection */}
          <div className="card p-8 mb-8 animate-fade-in border-l-4 border-green-500">
            <h2 className="font-heading text-2xl font-bold text-green-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              Data Protection
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                We <span className="font-semibold">do not sell or share</span> your data with third parties for marketing.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                Payment details are <span className="font-semibold">encrypted and handled securely</span>.
              </li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="card card-makhana p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-secondary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚖️</span>
              Your Rights
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                You can <span className="font-semibold">&nbsp;request access, correction, or deletion &nbsp;</span> of your personal data.
              </li>
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                You can <span className="font-semibold">&nbsp;opt out&nbsp;</span> of marketing emails anytime.
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🍪</span>
              Cookies
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                We use cookies to <span className="font-semibold">&nbsp;enhance your browsing experience&nbsp;</span>.
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                You may disable cookies in your browser if you prefer.
              </li>
            </ul>
          </div>

          {/* Updates */}
          <div className="card p-8 mb-8 animate-fade-in bg-gradient-to-r from-primary-50 to-secondary-50">
            <h2 className="font-heading text-2xl font-bold text-primary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🔄</span>
              Updates
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              We may update this policy from time to time. Please review periodically.
            </p>
          </div>

          {/* Contact Information */}
          <div className="card p-8 mb-8 animate-fade-in border-2 border-primary-200">
            <h2 className="font-heading text-2xl font-bold text-primary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">📞</span>
              Contact Us
            </h2>
            <div className="text-neutral-700 leading-relaxed">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact us:
              </p>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="mb-2"><span className="font-semibold">Email:</span> privacy@mindymunchs.com</p>
                <p className="mb-2"><span className="font-semibold">Phone:</span> +91-XXXX-XXXXXX</p>
                <p><span className="font-semibold">Address:</span> [Your Business Address]</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-secondary-500 to-primary-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h3 className="text-white text-xl font-heading mb-4">
              Your Privacy Matters
            </h3>
            <p className="text-white/90 text-lg font-accent mb-6 max-w-2xl mx-auto">
              We're committed to transparency and protecting your personal information. 
              Shop with confidence knowing your data is secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary bg-white text-primary-700 hover:bg-neutral-100 font-heading transition-all duration-300">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
