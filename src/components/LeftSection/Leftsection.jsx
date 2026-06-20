import React from 'react';

const LeftSection = () => {

  const activeTab = "Dashboard";

  const menuItems = ["Dashboard", "Properties", "Tenants", "Calculator", "Payments", "Settings"];

  return (
    <div className='h-full w-1/6 bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-2xl flex flex-col text-left gap-10 py-6 px-6 relative shadow-xl'>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
      

      <div className='flex flex-col text-sm font-medium gap-2'>
        {menuItems.map((item) => {
          const isActive = activeTab === item;
          return (
            <div 
              key={item}
              className={`px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-blue-950/40 text-blue-400 border border-blue-900/40" 
                  : "text-gray-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSection;