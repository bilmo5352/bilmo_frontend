import { Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MainContent = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 space-y-4 text-center"
        >
          <div className="inline-block mb-2">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-primary/20 mb-4 animate-fade-in">
              <Zap className="w-4 h-4 text-primary animate-sparkle" />
              <span className="text-xs font-semibold text-primary">AI-Powered Platform</span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight animate-fade-in-up delay-200">
            <span className="text-foreground inline-block">Intelligently</span>{' '}
            <span className="text-gradient inline-block animate-gradient-shift">Smart Search</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-400">
            Enterprise-grade search platform powered by AI. Find flights, hotels, products, and more with unprecedented accuracy and speed.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="relative group">
            {/* Glowing effect on focus */}
            {isFocused && (
              <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-60 animate-pulse"></div>
            )}
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask Bilmo agent about what you want to make shopping easier..."
                className="relative w-full h-14 bg-card backdrop-blur-sm border border-border/50 rounded-xl px-4 md:px-6 text-base md:text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 hover:shadow-md shadow-sm"
              />
            </form>
            
            <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 md:gap-2 bg-primary px-2 md:px-3 py-1 md:py-1.5 rounded-lg glow animate-pulse-glow">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground animate-spin-slow" />
                <span className="text-xs font-semibold text-primary-foreground hidden sm:inline">AI Enhanced</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div ref={featuresRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="feature-card bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 glow">
              <Zap className="w-6 h-6 text-primary animate-sparkle" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">AI Powered</h3>
            <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">Advanced machine learning algorithms for smarter results</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="feature-card bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl delay-200"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 glow">
              <svg className="w-6 h-6 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">Get results in milliseconds with optimized search</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="feature-card bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:shadow-xl delay-400"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 glow">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Secure & Private</h3>
            <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">Your data is encrypted and never shared</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
