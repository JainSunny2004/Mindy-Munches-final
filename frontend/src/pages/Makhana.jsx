import React from "react";
import { Link } from "react-router-dom";

const Makhana = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Orange-Yellow Gradient Background */}
      <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-1">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center">
            <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl w-full">
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <img
                  src="/makhana2-static.png"
                  alt="Makhana Product"
                  className="w-full h-full object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-2">
          <div className="space-y-4 sm:space-y-6 max-w-lg text-center lg:text-left">
            <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-800 leading-tight">
              Empowered Eating:
              <br />
              <span className="text-accent-700 text-2xl sm:text-4xl lg:text-4xl">
                Your Snack, Your Style, Your Control
              </span>{" "}
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              With DIY Makhana, you decide how your snack turns out. Choose the
              flavor intensity — bold, subtle, or perfectly balanced. Control
              the oil and quantity — enjoy it roasted and light. Quick to prep,
              super easy to enjoy — ready in just minutes.
            </p>

            <button className="btn-accent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:scale-105 transform transition-all duration-300 shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Premium Quality Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Section */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-800 text-center lg:text-left">
                The Many Benefits of Makhana 
              </h2>

              <p className="text-base sm:text-lg text-neutral-700 mb-4 sm:mb-6 text-center lg:text-left">
                Makhana isn't just crunchy and delicious — it's a powerhouse of
                wellness. Regular consumption may help:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700">
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Boost antioxidants</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">
                    Maintain healthy sugar levels
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">
                    Support weight management
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">
                    Balance hormones naturally
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Prevent inflammation</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Improve digestion</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Detoxify the liver</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Slow down ageing</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Strengthen kidneys</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">
                    ✅
                  </span>
                  <p className="text-sm sm:text-base">Keep bones strong</p>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg">
                    <img
                      src="/makhana-static.jpg"
                      alt="Makhana health benefits"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Varieties Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 mb-3 sm:mb-4">
            <span className="text-accent-800">Premium Quality Makhana</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-800 mb-8 sm:mb-12">
            High-Grade, Hand-Picked Fox Nuts 
          </p>

          {/* Reduced width container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Peri-Peri Makhana */}
            <Link to="/products/peri-peri-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/PERI-PERI-makhana.png"
                    alt="Peri-Peri Makhana"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Peri-Peri Makhana
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Fiery & Bold Spice Blend
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            {/* Tomato Makhana */}
            <Link to="/products/tomato-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/tomato-main.png"
                    alt="Tomato Makhana"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Tomato Makhana
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Tangy & Zesty Flavor
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            {/* Minty Masala Makhana */}
            <Link to="/products/minty-masala-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/minty-masala.png"
                    alt="Minty Masala Makhana"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Minty Masala Makhana
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Cool & Refreshingly Spiced
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Nutritional Powerhouse Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-4 order-2 lg:order-1">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-neutral-800 text-center lg:text-left">
                Nutritional Powerhouse 
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    High Protein Content -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      9.7g protein per 100g, perfect for muscle building
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Rich in Antioxidants -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Contains gallic acid and epicatechin for anti-aging
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Low Calorie Snack -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Only 347 calories per 100g, guilt-free munching
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    High Fiber -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      14.5g fiber per 100g for better digestion
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Essential Minerals -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Rich in calcium, magnesium, potassium, and phosphorus
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Heart Healthy -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Low in saturated fats and cholesterol-free
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <img
                    src="/makhana3-static.jpg"
                    alt="Makhana nutrition facts"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Make It Your Way Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Section */}
            <div className="relative order-1 lg:order-1 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <img
                    src="/makhana1-static.jpg"
                    alt="Makhana recipes"
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-3 sm:space-y-4 order-2 lg:order-2">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 text-center lg:text-left">
                Make It Your Way 
              </h2>

              <p className="text-base sm:text-lg text-neutral-800 mb-4 sm:mb-6 text-center lg:text-left">
                DIY Makhana isn't limited to just snacking — it's versatile
                enough for your kitchen experiments:
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Creamy Makhana Kheer */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Creamy Makhana Kheer -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Rich and indulgent dessert perfect for festivities
                    </span>
                  </h3>
                </div>

                {/* Nutritious Makhana Poha */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Nutritious Makhana Poha -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Healthy breakfast option with added crunch and protein
                    </span>
                  </h3>
                </div>

                {/* Crunchy Makhana Bhel */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Crunchy Makhana Bhel -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Street-food style chaat with a healthy twist
                    </span>
                  </h3>
                </div>

                {/* Flavor Varieties */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Flavor Varieties -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Minty Masala, Spicy Peri Peri, Tangy Sweet Tomato
                    </span>
                  </h3>
                </div>
              </div>

              <div className="bg-accent-50 rounded-lg p-4 sm:p-6 mt-6 border border-accent-200">
                <p className="text-sm sm:text-base text-accent-800 font-medium">
                  👉 Perfect for health-conscious snackers, kids, or anyone who
                  loves a fun twist on everyday munching!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-neutral-800">
            Why Choose Makhana?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center text-3xl sm:text-4xl">
                  🍿
                </div>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-800">
                Regular Snacks
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                High calories, processed ingredients, artificial preservatives
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-6 sm:p-8 shadow-lg border-2 border-accent-200">
              <div className="mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-accent-200 flex items-center justify-center text-3xl sm:text-4xl">
                  🌰
                </div>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-800">
                Makhana
              </h3>
              <p className="text-sm sm:text-base text-accent-700">
                Natural, protein-rich, antioxidant-packed, heart-healthy
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl sm:text-4xl">
                  🥜
                </div>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-800">
                Other Nuts
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                High fat content, may cause allergies, heavy on stomach
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ways to Enjoy Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-800 mb-3 sm:mb-4">
              Ways to Enjoy Makhana 
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover delicious and nutritious ways to incorporate Makhana into
              your daily routine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Roasted Makhana Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🌰
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Roasted Makhana
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Simply roasted with a pinch of salt - the classic way to enjoy
                these crunchy lotus seeds
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Classic & Crunchy
              </div>
            </div>

            {/* Makhana Kheer Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥛
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Makhana Kheer
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Rich and creamy traditional dessert perfect for festivals and
                special occasions
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Sweet & Festive
              </div>
            </div>

            {/* Spiced Makhana Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🌶️
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Spiced Varieties
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Minty masala, peri peri, and tangy tomato flavors for exciting
                snack experiences
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Bold & Flavorful
              </div>
            </div>

            {/* Makhana Poha Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🍚
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Makhana Poha
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Nutritious breakfast option combining the goodness of poha with
                crunchy makhana
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Healthy Breakfast
              </div>
            </div>

            {/* Makhana Bhel Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥗
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Makhana Bhel
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Street-food style chaat with a healthy twist - perfect evening
                snack for the family
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Street Food Style
              </div>
            </div>

            {/* Trail Mix Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥜
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Makhana Trail Mix
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Mix with nuts and dried fruits for a perfect on-the-go healthy
                snacking option
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                On-the-Go Energy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Makhana;
