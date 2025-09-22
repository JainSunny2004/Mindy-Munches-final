import React from "react";
import { Link } from "react-router-dom";

const Sattu = () => {
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
                  src="/sattu-static.jpg"
                  alt="Sattu Product"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-2">
          <div className="space-y-4 sm:space-y-6 max-w-lg text-center lg:text-left">
            <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-800 leading-tight">
              Sattu -
              <br />
              <span className="text-accent-700 text-3xl sm:text-4xl lg:text-5xl">
                Sip It, Eat It, Your Way
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              At Mindy Munchs, we bring back the wisdom of traditional Indian
              superfoods to modern kitchens. From Bihar, stone ground to
              preserve it s complete n rustic flavour. Packed with protein,
              fibre and other essential nutrients to help beat hunger, boost
              energy, gut health, and everyday wellness.
            </p>

            <button className="btn-accent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:scale-105 transform transition-all duration-300 shadow-lg">
              Buy Now
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
                Premium Quality, Rooted in Tradition
              </h2>

              <div className="space-y-3 sm:space-y-4 text-neutral-700">
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg sm:text-xl flex-shrink-0">
                    •
                  </span>
                  <p className="text-sm sm:text-base">
                    100% Natural Using high-quality from Bihar, premium
                    ingredients
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg sm:text-xl flex-shrink-0">
                    •
                  </span>
                  <p className="text-sm sm:text-base">
                    Authentic roasting and traditionally processed
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg sm:text-xl flex-shrink-0">
                    •
                  </span>
                  <p className="text-sm sm:text-base">
                    A True heritage superfood trusted Generations
                  </p>
                </div>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-neutral-800 text-center lg:text-left">
                A Powerhouse of Nutrition
              </h3>

              <div className="space-y-3 text-neutral-700">
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg sm:text-xl flex-shrink-0">
                    •
                  </span>
                  <p className="text-sm sm:text-base">
                    High in Plant Protein - supports muscles and tissue
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg sm:text-xl flex-shrink-0">
                    •
                  </span>
                  <p className="text-sm sm:text-base">
                    Loaded with Micronutrients - iron, magnesium, manganese and
                    phosphorus
                  </p>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg">
                    <img
                      src="/sattu1-static.jpg"
                      alt="Premium Sattu preparation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Flavors Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 mb-3 sm:mb-4">
            <span className="text-accent-800">
              Three Flavors, Endless Possibilities
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-800 mb-8 sm:mb-12">
            100% Roasted Bengal Gram
          </p>

          {/* Reduced width container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Classic Sattu */}
            <Link to="/products/classic-sattu" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/classic-sattu.png"
                    alt="Classic Sattu"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Classic Sattu
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Vanilla sattu make it your way
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            {/* Jaggery Sattu */}
            <Link to="/products/jaggery-sattu" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/jaljira-sattu.png"
                    alt="Jaggery Sattu"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Jaljira Sattu
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Bold, tangy n spicy
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            {/* Masala Sattu */}
            <Link to="/products/masala-sattu" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
                {/* Reduced height */}
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img
                    src="/masala_sattu.png"
                    alt="Masala Sattu"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Masala Sattu
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Spicy but balanced 
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

      {/* Energy Powerhouse Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-4 order-2 lg:order-1">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-neutral-800 text-center lg:text-left">
                Sattu – The Energy Powerhouse
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Sustained Energy -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Slow-digesting carbs giving you long-lasting energy
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Muscle Support -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      High protein strengthens the muscle 
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Diabetic-Friendly -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Low glycaemic index, stabilises sugar levels
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Women's Wellness -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Supports harmonal balance , adds fibre and maintains iron
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Anti-Inflammatory & Detoxifying -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Aids digestive, liver and kidney health
                    </span>
                  </h3>
                </div>

                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Anti-Ageing Properties -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Trans-BHA, omega-3, and antioxidants youthful
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <img
                    src="/sattu2-static.jpg"
                    alt="Sattu energy benefits"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Protein Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Section */}
            <div className="relative order-1 lg:order-1 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <img
                    src="/sattu3-static.jpg"
                    alt="Plant protein benefits"
                    className="w-full h-9/10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-3 sm:space-y-4 order-2 lg:order-2">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 text-center lg:text-left">
                Why Plant Protein Matters 🌱
              </h2>

              <p className="text-base sm:text-lg text-neutral-800 mb-4 sm:mb-6 text-center lg:text-left">
                Unlike animal proteins that bring cholesterol and digestive
                strain, plant proteins are lighter, ethical, and plant-friendly.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Gut Health */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Gut Health -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Supports gut health with probiotic fiber
                    </span>
                  </h3>
                </div>

                {/* Sustainable Energy */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Sustainable Energy -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Provides sustainable energy with complex carbs
                    </span>
                  </h3>
                </div>

                {/* Disease Prevention */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Disease Prevention -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Helps in chronic disease prevention (diabetes, heart
                      disease, inflammation)
                    </span>
                  </h3>
                </div>

                {/* Women's Health */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Women's Health -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      A better choice for women, weight management, and overall
                      health
                    </span>
                  </h3>
                </div>

                {/* Planet Friendly */}
                <div className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    Planet Friendly -{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm ml-2 sm:ml-3 font-normal">
                      Planet-friendly: lower water and land use compared to
                      animal proteins
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-neutral-800">
            Think of it this way:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <img
                  src="animal_protien.png"
                  alt="Animal Protein"
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full"
                />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-800">
                Animal Protein
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                quick energy, heavy to process
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <img
                  src="/plant_protein.png"
                  alt="Sattu Plant Protein"
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full"
                />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-800">
                Sattu (Plant Protein)
              </h3>
              <p className="text-sm sm:text-base text-orange-700">
                long-term nutrition, holistic, sustainable
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
              Ways to Enjoy Sattu
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover delicious and nutritious ways to incorporate Sattu into
              your daily routine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Sattu Drink Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥤
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Sattu Drink
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Mix with water for an instant energy cooler - perfect for hot
                summer days and post-workout refreshment
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Quick & Refreshing
              </div>
            </div>

            {/* Sattu Paratha Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥟
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Sattu Paratha
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Stuffed flatbreads that are wholesome and filling - a
                traditional breakfast loved across India
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Traditional & Hearty
              </div>
            </div>

            {/* Sattu Laddus Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🍯
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Sattu Laddus
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Sweet and energizing snack balls - perfect for festive occasions
                and healthy indulgence
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Sweet & Energizing
              </div>
            </div>

            {/* Raw Sattu Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🌾
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Raw Sattu
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Refreshing summer drink with cooling properties - nature's own
                electrolyte replenisher
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Cooling & Natural
              </div>
            </div>

            {/* Roasted Sattu Shake Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥛
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Roasted Sattu Shake
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Spiced, tangy, and pepper-packed - a flavorful protein boost for
                your active lifestyle
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Spiced & Protein-Rich
              </div>
            </div>

            {/* Sattu Smoothie Card */}
            <div className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                  🥤
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                  Sattu Smoothie
                </h3>
              </div>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Blend with fruits for a nutritious breakfast smoothie - modern
                twist on ancient nutrition
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                Modern & Nutritious
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sattu;
