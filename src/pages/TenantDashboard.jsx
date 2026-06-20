import React from 'react';
import { useAuthStore } from '../supabase/store/AuthStore';
import TenantHeader from '../components/TenantHeader';

const TenantDashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const profile = useAuthStore((state) => state.profile);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <h1 className="text-3xl font-bold text-emerald-400">Tenant Portal Dashboard</h1>
      <p className="text-gray-400 mt-2 text-sm">Welcome back, {profile?.full_name || 'Tenant'}!</p>
      <button onClick={() => logout()} className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-medium transition-all">
        Sign Out
      </button>
    </div>
  );
};
export default TenantDashboard;