import React from "react";
import { Link } from "react-router-dom";

const timeline = [
  {
    year: "2012",
    title: "The Cricket Academy Days",
    position: 1,
    content: (
      <div className="space-y-3">
        <p className="text-neutral-600 leading-relaxed text-sm">
          When my elder son started cricket, I carried fruits for his journey
          home. Sometimes he ate, sometimes not. Each time I saw him tired but
          munching chips, I felt helpless and guilty.
        </p>
        <div className="bg-orange-50 border-l-3 border-orange-400 p-3 rounded-r-lg">
          <p className="text-orange-800 italic font-medium text-sm">
            "Tired, sweaty, hungry — yet munching on chips."
          </p>
        </div>
      </div>
    ),
  },
  {
    year: "2018–19",
    title: "The Chole Bhature Phase",
    position: 2,
    content: (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {["Chole Bhature", "Bread Pakoras", "Chocolates", "Colas"].map(
            (item) => (
              <span
                key={item}
                className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {item}
              </span>
            )
          )}
        </div>
        <p className="text-neutral-600 leading-relaxed text-sm">
          At first, I was happy they ate. But I noticed sugar spikes, fatigue,
          the crash. I read more—and realized it wasn't just food. It shaped
          their health, habits, horizon.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-yellow-800 font-semibold text-sm">
            This wasn't just food. It was shaping their health, habits, and
            horizon.
          </p>
        </div>
      </div>
    ),
  },
  {
    year: "?",
    title: "The Question",
    position: 3,
    content: (
      <blockquote className="text-lg text-neutral-700 italic font-light leading-relaxed border-l-3 border-accent-400 pl-4">
        "Why do healthy choices always feel so hard? Why can't they be just as
        easy, just as tasty, just as tempting?"
      </blockquote>
    ),
  },
  {
    year: "Today",
    title: "The Spark",
    position: 6,
    content: (
      <div className="space-y-3">
        <blockquote className="text-base text-neutral-700 italic mb-3 font-light">
          "This feels good."
        </blockquote>
        <p className="text-neutral-600 leading-relaxed text-sm">
          We all crave food that's quick, convenient, comforting… but what if it
          could also be clean, conscious, and caring?
        </p>
        <div className="bg-gradient-to-r from-accent-100 to-orange-100 border border-accent-200 p-3 rounded-lg">
          <p className="text-accent-700 font-bold text-sm">
            That thought became a spark. That spark became Mindy Munchs.
          </p>
        </div>
      </div>
    ),
  },
  {
    year: "Experiment",
    title: "The Experiment",
    position: 5,
    content: (
      <div className="space-y-3">
        <p className="text-neutral-600 leading-relaxed text-sm">
          I gave my boys roasted makhana and sattu after practice. They loved
          it. They asked for it. Slowly, chips and sodas lost their charm.
        </p>
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-green-800 font-semibold text-sm">
            To my surprise, they loved it.
          </p>
        </div>
      </div>
    ),
  },
  {
    year: "Childhood",
    title: "Childhood Memories",
    position: 4,
    content: (
      <div className="space-y-3">
        <p className="text-neutral-600 leading-relaxed text-sm">
          That question took me back to my own childhood.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 text-center">
            <h4 className="font-bold text-accent-700 text-sm mb-1">Makhana</h4>
            <p className="text-accent-600 text-xs">
              Light • Crunchy • Comforting
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <h4 className="font-bold text-orange-700 text-sm mb-1">Sattu</h4>
            <p className="text-orange-600 text-xs">
              Filling • Hydrating• Nourishing
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

const Story = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-brand text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
            Our Story
          </h1>
          <div className="bg-white/80 backdrop-blur-sm border border-accent-200 rounded-2xl p-6 md:p-8 shadow-lg">
            <blockquote className="text-lg md:text-xl text-neutral-700 font-light italic leading-relaxed">
              "Why do healthy choices always feel so hard?"
              <span className="block text-accent-600 font-semibold mt-3 not-italic">
                Why can't they be just as easy, just as tasty, just as tempting?
              </span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 2x3 Grid Timeline with Proper Sequence Connections */}
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Grid Container with connecting lines */}
          <div className="relative">
            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {timeline.map((item, idx) => (
                <div key={item.year} className="relative group">
                  {/* Timeline Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative z-10">
                    {/* Year Badge with connecting line */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-accent-600 to-orange-600 text-white px-3 py-2 rounded-full font-bold text-sm min-w-[80px] text-center">
                        {item.year}
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-accent-400 to-orange-400 opacity-30"></div>
                    </div>

                    {/* Card Header */}
                    <h3 className="text-lg md:text-xl font-bold text-neutral-800 mb-4 leading-tight">
                      {item.title}
                    </h3>

                    {/* Card Content */}
                    <div className="flex-1">{item.content}</div>

                    {/* Card Footer with connecting element - Updated to use position number */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div className="w-8 h-1 bg-gradient-to-r from-accent-400 to-orange-400 rounded-full"></div>
                      <div className="text-xs text-neutral-400 font-medium">
                        {String(item.position).padStart(2, "0")}
                      </div>
                    </div>
                  </div>

                  {/* Connecting Lines Following Proper Sequence */}
                  {idx < timeline.length - 1 && (
                    <>
                      {/* Card 1 → Card 2: Horizontal Right */}
                      {idx === 0 && (
                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-orange-500 z-0">
                          <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                        </div>
                      )}

                      {/* Card 2 → Card 3: Horizontal Right */}
                      {idx === 1 && (
                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-orange-500 z-0">
                          <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                        </div>
                      )}

                      {/* Card 3 → Card 4: Complex path (Down and Left) */}
                      {idx === 2 && (
                        <div className="hidden lg:block absolute z-0">
                          {/* Vertical down line */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-0.5 h-8 bg-gradient-to-b from-accent-500 to-orange-500">
                            <div className="absolute -bottom-1.5 -left-1.25 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                          </div>
                          {/* Horizontal connecting line to card 4 */}
                          <svg
                            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                            width="200"
                            height="32"
                            viewBox="0 0 200 32"
                          >
                            <path
                              d="M 0 0 L 0 16 L -160 16 L -160 32"
                              stroke="url(#gradient1)"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="0"
                            />
                            <defs>
                              <linearGradient
                                id="gradient1"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop
                                  offset="0%"
                                  style={{
                                    stopColor: "#f97316",
                                    stopOpacity: 1,
                                  }}
                                />
                                <stop
                                  offset="100%"
                                  style={{
                                    stopColor: "#ea580c",
                                    stopOpacity: 1,
                                  }}
                                />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="-160"
                              cy="32"
                              r="6"
                              fill="#ea580c"
                              stroke="white"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Card 4 → Card 5: Horizontal Right */}
                      {idx === 3 && (
                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-orange-500 z-0">
                          <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                        </div>
                      )}

                      {/* Card 5 → Card 6: Horizontal Right */}
                      {idx === 4 && (
                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-orange-500 z-0">
                          <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Because food isn't just fuel
          </h2>

          {/* Values Grid with connecting flow */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                <p className="text-base md:text-lg font-semibold text-red-600">
                  It's how we care
                </p>
                {/* Connection to next card */}
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-red-400 to-blue-400">
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                <p className="text-base md:text-lg font-semibold text-blue-600">
                  connect
                </p>
                {/* Connection to next card */}
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-blue-400 to-green-400">
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-base md:text-lg font-semibold text-green-700">
                  and contribute
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl font-bold text-accent-700">
            It's how we empower.
          </p>

          {/* Mission Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-accent-200 rounded-2xl p-6 md:p-8 shadow-lg">
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-6">
              At Mindy Munchs, we don't claim to be perfect. We're not here to
              preach. But we are here to create snacks and drinks that are as
              easy to reach for as the packaged ones — only kinder to your body.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="bg-accent-50 text-accent-700 px-4 py-2 rounded-full font-semibold border border-accent-200">
                Honest
              </span>
              <span className="bg-accent-50 text-accent-700 px-4 py-2 rounded-full font-semibold border border-accent-200">
                Clean
              </span>
              <span className="bg-accent-50 text-accent-700 px-4 py-2 rounded-full font-semibold border border-accent-200">
                Delicious
              </span>
            </div>
            <p className="text-neutral-600 italic">
              From my kitchen to yours — this is our journey.
            </p>
          </div>

          {/* Mantra Card */}
          <div className="bg-gradient-to-r from-accent-600 to-orange-600 text-white rounded-2xl p-6 md:p-8 shadow-lg">
            <p className="text-lg md:text-xl font-bold">
              Our Mantra: Reviving Wholesome Trafitional foods for Modern Convenience 

            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-accent-600 hover:bg-accent-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Try Our Products
            </Link>
            <Link
              to="/aboutus"
              className="bg-white text-accent-600 border-2 border-accent-600 hover:bg-accent-600 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Story;
