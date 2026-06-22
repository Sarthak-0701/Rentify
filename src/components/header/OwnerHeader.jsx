import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../supabase/store/AuthStore';
import { LogOut, User } from 'lucide-react';

const OwnerHeader = () => {
  const logout = useAuthStore((state) => state.logout);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout navigation failed:", error);
    }
  };

  return (
    <nav className="border-b border-slate-900 bg-slate-950 backdrop-blur-md sticky top-0 z-50 px-10 md:px-20 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/owner-dashboard')}>
        <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
          Rentify.
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
          Owner Portal
        </span>
      </div>

    {/* user info - name & email */}
      <div className="flex items-center gap-4">

        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-1.5 justify-end">
            <User className="w-3.5 h-3.5 text-blue-500" />
            {profile?.full_name || 'Owner'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{user?.email}</span>
        </div>

        {/* Sign Out Button */}
        <button
          id="btn-owner-logout"
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-red-900/40 hover:border-red-900 bg-red-950/20 hover:bg-red-900/80 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default OwnerHeader;
