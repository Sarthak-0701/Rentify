import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuthStore } from '../supabase/store/AuthStore';


const OwnerHeader = () => {
   
    const logout = useAuthStore((state) => state.logout);

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
    <>
      <nav className="border-b border-slate-850 bg-slate-950 backdrop-blur-md sticky top-0 z-50 px-25 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-3xl pl-3 cursor-pointer font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
          className="text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-900/30 px-4 py-2 rounded-lg"
          onClick={() => {
            handleLogoutClick();
          }}
          
          >
            Log Out
          </button>
        </div>
      </nav>
    </>
  )
}

export default OwnerHeader
