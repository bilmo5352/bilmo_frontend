import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const Header = ({ onMenuClick }) => {
  return (
    <header className="w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-md shadow-gray-200/50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
        >
          <FiMenu className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-white animate-pulse shadow-lg shadow-red-500/50">
              AI
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Bilmo Shopping Agent</h1>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Welcome to Bilmo</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 group">
          <FiSearch className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>
        
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 group">
          <FiBell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg shadow-red-500/50">
            3
          </span>
        </button>
        
        <button className="text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium hidden md:block hover:scale-105">
          Sign In
        </button>
        
        <button className="group relative gradient-purple px-4 md:px-6 py-2 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 text-sm md:text-base">
          <span className="relative z-10 flex items-center gap-1.5">
            <HiSparkles className="w-4 h-4 animate-sparkle" />
            Get Started
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;

