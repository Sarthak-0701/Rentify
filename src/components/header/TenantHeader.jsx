import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../supabase/store/AuthStore';
import { LogOut, User, Menu, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../supabase/store/ThemeStore';

const TenantHeader = ({ onToggleSidebar }) => {
  const logout = useAuthStore((state) => state.logout);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout navigation failed:", error);
    }
  };

  return (
    <nav className="border-b border-app-border bg-app-nav-bg backdrop-blur-md sticky top-0 z-50 px-6 md:px-20 py-5 md:py-6 flex items-center justify-between text-app-text-primary transition-colors">
      {/* Brand Logo & Burger Toggle */}
      <div className="flex items-center space-x-4">
        {/* Burger Button (visible only on screens < lg) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-app-text-secondary hover:text-app-text-primary transition-colors cursor-pointer focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/tenant-dashboard')}>
          <span className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
            Rentify.
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-app-tenant-accent bg-app-tenant-accent-glow border border-app-tenant-accent-border px-2 py-0.5 rounded-full hidden sm:inline-block">
            Tenant Portal
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-app-text-secondary hover:text-app-text-primary rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
        </button>

        {/* User Details */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-semibold text-app-text-primary capitalize flex items-center gap-1.5 justify-end">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            {profile?.full_name || 'Tenant'}
          </span>
          <span className="text-[9px] text-app-text-muted font-mono">{user?.email}</span>
        </div>

        {/* Sign Out Button */}
        <button
          id="btn-tenant-logout"
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-app-danger-border hover:border-app-danger bg-app-danger-glow hover:bg-app-danger hover:text-white text-app-danger rounded-lg transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default TenantHeader;
