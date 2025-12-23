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
    <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-800 h-screen flex flex-col border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/50">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-800">
              AI
            </div>
          </div>
          <span className="text-xl font-bold text-white">Bilmo</span>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                item.active
                  ? 'gradient-purple shadow-lg shadow-purple-500/30'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className={`font-medium ${item.active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-purple-400 text-sm">
          <HiSparkles className="w-4 h-4" />
          <span>AI Powered</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

