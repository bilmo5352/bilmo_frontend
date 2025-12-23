import { Home, DollarSign, Star, Bell, BarChart2, X, Zap } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: Home, label: 'Chat', active: true },
    { icon: DollarSign, label: 'Top Deals', badge: 12 },
    { icon: Star, label: 'Featured' },
    { icon: Bell, label: 'Price Alerts', badge: 3 },
    { icon: BarChart2, label: 'Analytics' },
  ];

  return (
    <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-card backdrop-blur-md h-screen flex flex-col border-r border-border z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl glow transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-destructive-foreground border-2 border-card animate-pulse shadow-lg">
              AI
            </div>
          </div>
          <span className="text-xl font-bold text-foreground">Bilmo</span>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
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
                  ? 'bg-primary text-primary-foreground shadow-lg glow'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:shadow-md border border-transparent hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${item.active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'}`} />
                <span className={`font-medium transition-colors ${item.active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg ${
                  item.active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/20 text-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <Zap className="w-4 h-4 animate-sparkle" />
          <span>AI Powered</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
