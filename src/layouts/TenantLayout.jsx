import React, { useState } from 'react';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import TenantHeader from '../components/header/TenantHeader';
import TenantSidebar from '../components/sidebar/TenantSidebar';
import { useAuthStore } from '../supabase/store/AuthStore';

const TenantLayout = () => {
  const profile = useAuthStore((state) => state.profile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 antialiased selection:bg-emerald-600/30 selection:text-white">
      <TenantHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="grow flex w-full items-start relative">
        {/* Background emerald radial glow */}
        <div className="absolute top-10 left-64 -z-10 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block">
          <TenantSidebar />
        </div>

        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Sliding Drawer */}
        <div className={`fixed inset-y-0 left-0 z-50 w-70 bg-slate-950 border-r border-slate-900/60 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <TenantSidebar isMobile onClose={() => setIsSidebarOpen(false)} />
        </div>
        
        <main className="grow px-4 sm:px-10 py-6 bg-linear-to-br from-slate-950/40 via-gray-950 to-black flex flex-col space-y-3 overflow-x-hidden">
          <div className="w-full max-w-7xl mx-auto grow flex flex-col">
            <p className="text-gray-200 mb-4 text-md sm:text-lg font-bold capitalize">
              Welcome back, {profile?.full_name || 'Tenant'}!
            </p>
            <Outlet /> 
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default TenantLayout;
