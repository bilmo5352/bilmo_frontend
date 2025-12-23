import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';

const Header = ({ onMenuClick }) => {
  return (
    <header className="w-full h-20 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <FiMenu className="w-6 h-6 text-gray-400 hover:text-white" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-white">Bilmo Shopping Agent</h1>
          <p className="text-xs md:text-sm text-gray-400 hidden sm:block">Welcome to Bilmo</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
          <FiSearch className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
        </button>
        
        <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
          <FiBell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            3
          </span>
        </button>
        
        <button className="text-gray-300 hover:text-white transition-colors duration-200 font-medium hidden md:block">
          Sign In
        </button>
        
        <button className="gradient-purple px-4 md:px-6 py-2 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105 text-sm md:text-base">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;

