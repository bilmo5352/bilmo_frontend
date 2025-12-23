import { FiHome, FiDollarSign, FiStar, FiBell, FiBarChart2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

import { FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: FiHome, label: 'Chat', active: true },
    { icon: FiDollarSign, label: 'Top Deals', badge: 12 },
    { icon: FiStar, label: 'Featured' },
    { icon: FiBell, label: 'Price Alerts', badge: 3 },
    { icon: FiBarChart2, label: 'Analytics' },
  ];

  return (
    <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-md h-screen flex flex-col border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out shadow-lg shadow-gray-200/50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white animate-pulse shadow-lg shadow-red-500/50">
              AI
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">Bilmo</span>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
        >
          <FiX className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group transform hover:scale-105 ${
                item.active
                  ? 'gradient-purple shadow-lg shadow-purple-500/30 text-white'
                  : 'hover:bg-purple-50 text-gray-700 hover:shadow-md border border-transparent hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${item.active ? 'text-white' : 'text-gray-600 group-hover:text-purple-600 group-hover:scale-110'}`} />
                <span className={`font-medium transition-colors ${item.active ? 'text-white' : 'text-gray-700 group-hover:text-purple-600'}`}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-blue-500/50">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
        <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
          <HiSparkles className="w-4 h-4 animate-sparkle" />
          <span>AI Powered</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

