import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../supabase/store/AuthStore';
import { LogOut, User } from 'lucide-react';

const TenantHeader = () => {
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
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/tenant-dashboard')}>
        <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-emerald-400 to-slate-200 bg-clip-text text-transparent">
          Rentify.
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
          Tenant Portal
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* User Details */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-300 capitalize flex items-center gap-1.5 justify-end">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            {profile?.full_name || 'Tenant'}
          </span>
          <span className="text-[9px] text-slate-500 font-mono">{user?.email}</span>
        </div>

        {/* Sign Out Button */}
        <button
          id="btn-tenant-logout"
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-red-900/40 hover:border-red-900 bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
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
