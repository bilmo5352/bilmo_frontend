import { HiSparkles } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';

const MainContent = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('.feature-card');
      cards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex-1 bg-transparent p-4 md:p-8 overflow-y-auto relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-pulse-slow delay-1500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className={`mb-8 md:mb-12 space-y-4 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block mb-2">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect-light border border-purple-300/50 mb-4 animate-fade-in shadow-sm">
              <HiSparkles className="w-4 h-4 text-purple-600 animate-sparkle" />
              <span className="text-xs font-semibold text-purple-700">AI-Powered Platform</span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight animate-fade-in-up delay-200">
            <span className="text-gray-900 inline-block">Intelligently</span>{' '}
            <span className="gradient-text-purple inline-block animate-gradient-shift">Smart Search</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-400">
            Enterprise-grade search platform powered by AI. Find flights, hotels, products, and more with unprecedented accuracy and speed.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative animate-fade-in-up delay-600">
          <div className="relative group">
            {/* Glowing effect on focus */}
            {isFocused && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-xl blur opacity-60 animate-pulse"></div>
            )}
            
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask Bilmo agent about what you want to make shopping easier..."
              className="relative w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 md:px-6 py-4 md:py-5 text-base md:text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 hover:border-purple-300 hover:bg-white hover:shadow-md shadow-sm"
            />
            
            <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 md:gap-2 gradient-purple px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-lg shadow-purple-500/40 animate-pulse-glow">
                <HiSparkles className="w-3 h-3 md:w-4 md:h-4 text-white animate-spin-slow" />
                <span className="text-xs font-semibold text-white hidden sm:inline">AI Enhanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Text */}
        <p className="text-gray-600 mb-8 text-center animate-fade-in delay-800">
          Sign in to access advanced search features and save your preferences.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in-up delay-1000">
          <button className="group relative w-full sm:w-auto bg-white border-2 border-purple-500 text-purple-600 px-6 md:px-8 py-3 rounded-lg font-semibold overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 hover:bg-purple-50">
            <span className="relative z-10 flex items-center gap-2">
              Sign In
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="group relative w-full sm:w-auto gradient-purple px-6 md:px-8 py-3 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <HiSparkles className="w-4 h-4 animate-sparkle" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card glass-effect-light p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-100 hover:bg-white/80 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-purple-200/50 border-2 hover:border-purple-300">
            <div className="w-12 h-12 gradient-purple rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
              <HiSparkles className="w-6 h-6 text-white animate-sparkle" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">AI Powered</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Advanced machine learning algorithms for smarter results</p>
          </div>
          
          <div className="feature-card glass-effect-light p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-green-100 hover:bg-white/80 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-green-200/50 border-2 hover:border-green-300 delay-200">
            <div className="w-12 h-12 gradient-green rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
              <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Lightning Fast</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Get results in milliseconds with optimized search</p>
          </div>
          
          <div className="feature-card glass-effect-light p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:bg-white/80 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-blue-200/50 border-2 hover:border-blue-300 delay-400">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Secure & Private</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Your data is encrypted and never shared</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;

