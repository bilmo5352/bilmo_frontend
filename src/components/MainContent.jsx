import { HiSparkles } from 'react-icons/hi';
import { useState } from 'react';

const MainContent = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <main className="flex-1 bg-gray-900 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 md:mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-white">Intelligently</span>{' '}
            <span className="gradient-text-purple">Smart Search</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
            Enterprise-grade search platform powered by AI. Find flights, hotels, products, and more with unprecedented accuracy and speed.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Ask Bilmo agent about what you want to make shopping easier..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 md:px-6 py-4 md:py-5 text-base md:text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
            />
            <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 md:gap-2 bg-purple-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                <HiSparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                <span className="text-xs font-semibold text-white hidden sm:inline">AI Enhanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Text */}
        <p className="text-gray-400 mb-8 text-center">
          Sign in to access advanced search features and save your preferences.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <button className="w-full sm:w-auto gradient-purple px-6 md:px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105">
            Sign In
          </button>
          <button className="w-full sm:w-auto gradient-green px-6 md:px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200 transform hover:scale-105">
            Get Started
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect p-6 rounded-xl hover:bg-gray-800/50 transition-all duration-200">
            <div className="w-12 h-12 gradient-purple rounded-lg flex items-center justify-center mb-4">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Powered</h3>
            <p className="text-gray-400 text-sm">Advanced machine learning algorithms for smarter results</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl hover:bg-gray-800/50 transition-all duration-200">
            <div className="w-12 h-12 gradient-green rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Get results in milliseconds with optimized search</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl hover:bg-gray-800/50 transition-all duration-200">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm">Your data is encrypted and never shared</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;

