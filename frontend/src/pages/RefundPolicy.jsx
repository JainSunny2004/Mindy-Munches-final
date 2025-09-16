import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-accent-50 via-white to-primary-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center animate-slide-up">
            <h1 className="font-brand text-4xl md:text-5xl font-bold text-accent-700 mb-4">
              🔄 Return & Refund Policy
            </h1>
            <p className="text-lg text-neutral-600 font-accent max-w-2xl mx-auto">
              At <span className="font-brand font-semibold text-primary-700">Mindy Munchs</span>, 
              your satisfaction matters.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Eligible Returns */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">✅</span>
              Eligible Returns
            </h2>
            <div className="space-y-4">
              <div className="flex items-start bg-white/60 p-4 rounded-lg">
                <span className="text-accent-600 mr-3 mt-1 text-lg">📦</span>
                <span className="text-neutral-700">
                  <span className="font-semibold">Damaged during delivery</span> - Items that arrive in poor condition
                </span>
              </div>
              <div className="flex items-start bg-white/60 p-4 rounded-lg">
                <span className="text-accent-600 mr-3 mt-1 text-lg">❌</span>
                <span className="text-neutral-700">
                  <span className="font-semibold">Wrong product delivered</span> - Items different from what you ordered
                </span>
              </div>
              <div className="flex items-start bg-white/60 p-4 rounded-lg">
                <span className="text-accent-600 mr-3 mt-1 text-lg">📅</span>
                <span className="text-neutral-700">
                  <span className="font-semibold">Expired product received</span> - Products past their expiration date
                </span>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="card p-8 mb-8 animate-fade-in border-l-4 border-red-400">
            <h2 className="font-heading text-2xl font-bold text-red-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">🚫</span>
              Non-Returnable Items
            </h2>
            <div className="space-y-4">
              <div className="flex items-start bg-red-50 p-4 rounded-lg">
                <span className="text-red-500 mr-3 mt-1 text-lg">🍪</span>
                <span className="text-neutral-700">
                  <span className="font-semibold">Opened or partially consumed products</span> - For hygiene and safety reasons
                </span>
              </div>
              <div className="flex items-start bg-red-50 p-4 rounded-lg">
                <span className="text-red-500 mr-3 mt-1 text-lg">📦</span>
                <span className="text-neutral-700">
                  <span className="font-semibold">Products returned without original packaging</span> - Original packaging required for processing
                </span>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="card card-makhana p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-secondary-700 mb-6 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              Return Process
            </h2>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start">
                <div className="bg-secondary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg flex-1">
                  <h3 className="font-semibold text-secondary-700 mb-2">Contact Us Within 3 Days</h3>
                  <p className="text-neutral-700">
                    Reach out within <span className="font-semibold">3 days of delivery</span> at{' '}
                    <span className="font-semibold text-secondary-700">support@mindymunchs.com</span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start">
                <div className="bg-secondary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg flex-1">
                  <h3 className="font-semibold text-secondary-700 mb-2">Share Details & Images</h3>
                  <p className="text-neutral-700">
                    Provide your <span className="font-semibold">order details</span> and{' '}
                    <span className="font-semibold">clear images</span> of the issue
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start">
                <div className="bg-secondary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg flex-1">
                  <h3 className="font-semibold text-secondary-700 mb-2">Processing Time</h3>
                  <p className="text-neutral-700">
                    Once approved, <span className="font-semibold">refund/replacement</span> will be processed within{' '}
                    <span className="font-semibold">7–10 business days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Mode */}
          <div className="card card-sattu p-8 mb-8 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-accent-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">💳</span>
              Refund Mode
            </h2>
            <div className="bg-white/60 p-6 rounded-lg">
              <div className="flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl mb-3">🔄</div>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Refunds are <span className="font-semibold text-accent-700">credited back to your original mode of payment</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card p-8 mb-8 animate-fade-in bg-gradient-to-r from-primary-50 to-accent-50">
            <h2 className="font-heading text-2xl font-bold text-primary-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">📞</span>
              Need Help with Returns?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Email Support</h3>
                <p className="text-neutral-700">support@mindymunchs.com</p>
                <p className="text-sm text-neutral-500 mt-1">Response within 24 hours</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Phone Support</h3>
                <p className="text-neutral-700">+91-XXXX-XXXXXX</p>
                <p className="text-sm text-neutral-500 mt-1">Mon-Sat, 10 AM - 6 PM</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="card p-6 mb-8 animate-fade-in border-2 border-neutral-200">
            <h3 className="font-heading text-lg font-bold text-neutral-700 mb-3 flex items-center">
              <span className="text-lg mr-2">ℹ️</span>
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start">
                <span className="text-neutral-400 mr-2 mt-1">•</span>
                Please keep your order confirmation and packaging until you're satisfied with your purchase
              </li>
              <li className="flex items-start">
                <span className="text-neutral-400 mr-2 mt-1">•</span>
                Refund processing time may vary depending on your bank or payment method
              </li>
              <li className="flex items-start">
                <span className="text-neutral-400 mr-2 mt-1">•</span>
                For faster resolution, please include clear photos of any issues with your order
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-accent-500 to-secondary-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h3 className="text-white text-xl font-heading mb-4">
              Still Have Questions?
            </h3>
            <p className="text-white/90 text-lg font-accent mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help you with any return or refund queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-white text-accent-700 hover:bg-neutral-100 font-heading">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
