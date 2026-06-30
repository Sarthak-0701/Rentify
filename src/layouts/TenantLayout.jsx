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
    <div className="min-h-screen flex flex-col bg-app-bg text-app-text-primary antialiased selection:bg-app-accent-glow selection:text-app-accent transition-colors">
      <TenantHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="grow flex w-full items-stretch relative">
        {/* Background emerald radial glow */}
        <div className="absolute top-10 left-64 -z-10 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block self-stretch shrink-0">
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
        <div className={`fixed inset-y-0 left-0 z-50 w-70 bg-app-sidebar-bg border-r border-app-sidebar-border p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <TenantSidebar isMobile onClose={() => setIsSidebarOpen(false)} />
        </div>
        
        <main className="grow px-4 sm:px-10 py-6 bg-linear-to-b from-app-bg-from via-app-bg-from to-app-bg-to flex flex-col space-y-3 overflow-x-hidden transition-all">
          <div className="w-full max-w-7xl mx-auto grow flex flex-col">
            <p className="text-app-text-primary mb-4 text-md sm:text-lg font-bold capitalize">
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
