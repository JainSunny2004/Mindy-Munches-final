import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center animate-slide-up">
            <h1 className="font-brand text-4xl md:text-5xl font-bold text-primary-700 mb-4">
              📜 Terms & Conditions
            </h1>
            <p className="text-lg text-neutral-600 font-accent">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Welcome Section */}
          <div className="card p-8 mb-8 animate-fade-in">
            <p className="text-lg text-neutral-700 leading-relaxed mb-0">
              Welcome to{" "}
              <span className="font-brand font-semibold text-primary-700">
                Mindy Munchs{" "}
              </span>
              ! By accessing or purchasing from our website, you agree to the
              following terms and conditions:
            </p>
          </div>

          {/* Products & Usage */}
          <div className="card card-makhana p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-secondary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🥜</span>
              Products & Usage
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                Our snacks and drinks are crafted for everyday consumption.
              </li>
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                Please check ingredients before purchase to avoid allergies.
              </li>
            </ul>
          </div>

          {/* Orders & Payments */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">💳</span>
              Orders & Payments
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                All prices listed are in{" "}
                <span className="font-semibold"> &nbsp;INR&nbsp; </span> and
                inclusive of applicable taxes.
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                Payments must be completed at checkout for order confirmation.
              </li>
            </ul>
          </div>

          {/* Shipping & Delivery */}
          <div className="card p-8 mb-8 animate-fade-in border-l-4 border-primary-500">
            <h2 className="font-heading text-2xl font-bold text-primary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🚚</span>
              Shipping & Delivery
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-primary-500 mr-3 mt-1">•</span>
                We aim to dispatch all orders within{" "}
                <span className="font-semibold">&nbsp;2–5 business days</span>.
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-3 mt-1">•</span>
                Delivery timelines may vary based on your location.
              </li>
            </ul>
          </div>

          {/* Returns & Refunds */}
          <div className="card card-makhana p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-secondary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">↩️</span>
              Returns & Refunds
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                Returns are accepted only for damaged, defective, or wrongly
                delivered items.
              </li>
              <li className="flex items-start">
                <span className="text-secondary-500 mr-3 mt-1">•</span>
                See our detailed &nbsp;
                <span className="font-semibold text-secondary-700">
                  Return Policy
                </span>{" "}
                &nbsp; for more.
              </li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">©️</span>
              Intellectual Property
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                All content, packaging, and branding are owned by{" "}
                <span className="font-brand font-semibold">&nbsp;Mindy Munchs</span>.
              </li>
              <li className="flex items-start">
                <span className="text-accent-600 mr-3 mt-1">•</span>
                Reproduction without consent is prohibited.
              </li>
            </ul>
          </div>

          {/* Limitation of Liability */}
          <div className="card p-8 mb-8 animate-fade-in border-l-4 border-red-400">
            <h2 className="font-heading text-2xl font-bold text-red-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              Limitation of Liability
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                We are not liable for any adverse health effects due to
                undisclosed allergies.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Always consume responsibly.
              </li>
            </ul>
          </div>

          {/* Amendments */}
          <div className="card p-8 mb-8 animate-fade-in bg-gradient-to-r from-primary-50 to-accent-50">
            <h2 className="font-heading text-2xl font-bold text-primary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">📝</span>
              Amendments
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              <span className="font-brand font-semibold text-primary-700">
                Mindy Munchs
              </span>{" "}
              reserves the right to update these terms without prior notice.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-white text-lg font-accent mb-6">
            Have questions about our terms? We're here to help!
          </p>
          <button className="btn-primary bg-white text-primary-700 hover:bg-neutral-100 font-heading">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
