import React from 'react';
import { NavLink } from 'react-router-dom';

const TenantSidebar = ({ isMobile, onClose }) => {
  const linkStyle = ({ isActive }) =>
    `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
      isActive
        ? 'bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/20'
        : 'text-gray-400 hover:bg-slate-900/50 hover:text-white border border-transparent'
    }`;

  const containerClass = isMobile
    ? "flex flex-col h-full justify-between"
    : "w-70 sticky top-19 h-[calc(100vh-76px)] bg-slate-950/40 border-r border-slate-900/60 py-6 pl-10 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar";

  return (
    <div className={containerClass}>
      <div className="space-y-2">
        <NavLink to="/tenant-dashboard" end className={linkStyle} onClick={isMobile ? onClose : undefined}>
          <span>Dashboard Overview</span>
        </NavLink>

        <NavLink to="/tenant-dashboard/rent-history" className={linkStyle} onClick={isMobile ? onClose : undefined}>
          <span>Rent History</span>
        </NavLink>
        
        <NavLink to="/tenant-dashboard/about" className={linkStyle} onClick={isMobile ? onClose : undefined}>
          <span>About</span>
        </NavLink>
        
        <NavLink to="/tenant-dashboard/contact" className={linkStyle} onClick={isMobile ? onClose : undefined}>
          <span>Help</span>
        </NavLink>
      </div>
    </div>
  );
};

export default TenantSidebar;
