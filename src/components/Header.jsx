import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full h-20 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
        >
          <Menu className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm glow">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[8px] font-bold text-destructive-foreground border-2 border-card animate-pulse shadow-lg">
              AI
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-foreground">Bilmo Shopping Agent</h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Welcome back, {userName}!</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <button className="p-2 hover:bg-muted rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 group">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        
        <button className="relative p-2 hover:bg-muted rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-destructive-foreground animate-pulse shadow-lg">
            3
          </span>
        </button>
        
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted border border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">{userName}</span>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="group relative px-4 md:px-6 py-2 rounded-lg font-semibold text-foreground bg-card border border-border overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-destructive/50 hover:text-destructive text-sm md:text-base"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
