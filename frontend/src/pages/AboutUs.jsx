import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Orange-Yellow Gradient Background */}
      <div className="w-full min-h-[80vh] bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-800 leading-tight">
              About Us
              <br />
              <span className="text-accent-700 text-2xl sm:text-3xl lg:text-4xl">
                More Than Snacks, A Purpose
              </span>{" "}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              At Mindy Munchs, we are not just crafting snacks—we are responding 
              to a quiet, growing concern that touches nearly every Indian household: 
              the double burden of nutritional deficiency and lifestyle-related health issues.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link 
                to="/products" 
                className="btn-accent text-sm sm:text-base px-6 py-3 rounded-lg font-bold hover:scale-105 transform transition-all duration-300 shadow-lg"
              >
                Explore Our Products
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      {/* Health Statistics Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              The Reality We're Addressing 📊
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              These aren't just statistics—they're reminders that what we eat daily 
              shapes the health of our families, our communities, and our nation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Child Malnutrition */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👶</span>
                </div>
                <h3 className="font-heading text-3xl font-bold text-red-600 mb-2">
                  54%
                </h3>
                <h4 className="font-heading text-base font-bold text-neutral-800 mb-2">
                  Child Malnutrition Crisis
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Indian children are not growing properly—being either underweight, 
                  stunted, or overweight
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Source: Care Health, Aug '24
                </div>
              </div>
            </div>

            {/* Protein Deficiency */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥩</span>
                </div>
                <h3 className="font-heading text-3xl font-bold text-orange-600 mb-2">
                  73%
                </h3>
                <h4 className="font-heading text-base font-bold text-neutral-800 mb-2">
                  Protein Deficiency
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Indians are protein-deficient, lacking essential nutrients for 
                  muscle development and overall health
                </p>
              </div>
            </div>

            {/* Anemia Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📉</span>
                </div>
                <h3 className="font-heading text-3xl font-bold text-red-600 mb-2">
                  67.1%
                </h3>
                <h4 className="font-heading text-base font-bold text-neutral-800 mb-2">
                  Anemia in Youth
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Children and 59.1% of adolescent girls in India are anaemic
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Source: NHFS-5 data
                </div>
              </div>
            </div>

            {/* Magnesium Deficiency */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-heading text-base font-bold text-yellow-600 mb-2">
                  Widespread
                </h3>
                <h4 className="font-heading text-base font-bold text-neutral-800 mb-2">
                  Magnesium Deficiency
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Large portions of urban adults are deficient in magnesium—causing 
                  fatigue, cramps, and poor sleep
                </p>
              </div>
            </div>

            {/* Obesity Rising */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏋</span>
                </div>
                <h3 className="font-heading text-3xl font-bold text-red-600 mb-2">
                  12%
                </h3>
                <h4 className="font-heading text-base font-bold text-neutral-800 mb-2">
                  Rising Obesity
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Indians are overweight or obese today, costing 1.02% of GDP in 2019
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Source: HT, Mar '25
                </div>
              </div>
            </div>

            {/* Our Response */}
            <div className="bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-accent-200">
              <div className="text-center">
                <div className="w-14 h-14 bg-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💚</span>
                </div>
                <h3 className="font-heading text-base font-bold text-accent-800 mb-2">
                  Our Mission
                </h3>
                <h4 className="font-heading text-base font-bold text-accent-800 mb-2">
                  Nutritional Solutions
                </h4>
                <p className="text-sm text-accent-700 leading-relaxed font-medium">
                  We're addressing these challenges with traditional superfoods 
                  crafted for modern lifestyles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                Our Philosophy 🌱
              </h2>
              <p className="text-base sm:text-lg text-neutral-800 max-w-2xl mx-auto leading-relaxed">
                In a time when convenience often comes at the cost of health, we're choosing a different path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Reconnecting with Tradition
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  Bring back foods that heal, nourish, and belong to us—just served 
                  in a way that fits modern lifestyles.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Not Reinventing, Reconnecting
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  We're not reinventing food. We're reconnecting with it.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Health Begins at Home
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  A healthier, stronger India doesn't begin with prescriptions—it begins 
                  with what's on our plates, in our tiffins, and on our snack shelves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Believe Section - Neutral-50 Background */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                What We Believe 💚
              </h2>
              <p className="text-base sm:text-lg text-neutral-800 max-w-xl mx-auto leading-relaxed">
                At Mindy Munchs, this isn't just a business model—it's a belief.
              </p>
            </div>

            <div className="space-y-4">
              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      The Right Snack at the Right Time
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Can fuel not just your day, but your life.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      Traditional Foods Deserve Revival
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Wholesome foods, once rooted in tradition, deserve a revival in modern homes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💪</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      Every Bite Should Nourish
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Every bite should nourish, energize, and empower.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section - Orange-Yellow Gradient Background */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                Reviving Wholesome Foods for Modern Lifestyles 🚀
              </h2>
              <p className="text-base sm:text-lg text-neutral-700 max-w-4xl mx-auto leading-relaxed">
                From heritage ingredients like Sattu to light, protein-rich Makhana, we are 
                reintroducing the power of India's forgotten superfoods—crafted thoughtfully 
                for today's busy, health-conscious world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Sattu Card */}
              <Link to="/sattu" className="block group">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-2xl mr-4">
                      🌾
                    </div>
                    <h3 className="font-heading text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                      Sattu
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Traditional superfood from Bihar, packed with protein and essential nutrients. 
                    Perfect for energy drinks, parathas, and healthy snacking.
                  </p>
                  <div className="flex items-center text-xs text-accent-500">
                    <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Heritage Superfood
                  </div>
                </div>
              </Link>

              {/* Makhana Card */}
              <Link to="/makhana" className="block group">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-2xl mr-4">
                      🌰
                    </div>
                    <h3 className="font-heading text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                      Makhana
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Light, protein-rich fox nuts that are perfect for healthy snacking. 
                    Low in calories, high in nutrition, and incredibly versatile.
                  </p>
                  <div className="flex items-center text-xs text-accent-500">
                    <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Protein Powerhouse
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto border-2 border-accent-200">
                <p className="text-base sm:text-lg font-medium text-accent-800 mb-4 leading-relaxed">
                  Because eating right shouldn't feel like a sacrifice—it should feel like coming home to better health.
                </p>
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-bold text-accent-700">
                    👉 That's who we are. That's what we stand for.
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-accent-800">
                    Mindy Munchs: Reviving Wholesome Foods for Modern Lifestyles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
