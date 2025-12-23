import { FiSearch, FiBell, FiMenu, FiLogOut } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
  };

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
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Welcome back, {userName}!</p>
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
        
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
          <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="group relative px-4 md:px-6 py-2 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-red-300 hover:text-red-600 text-sm md:text-base"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;

