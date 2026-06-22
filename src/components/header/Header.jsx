import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-10 md:px-20 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
          Rentify.
        </span>
      </div>

      {/* Navigation links */}
      <div className="flex gap-8 tracking-wide select-none">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `text-sm font-semibold transition-all ${
            isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
          }`}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `text-sm font-semibold transition-all ${
            isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
          }`}
        >
          About
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => `text-sm font-semibold transition-all ${
            isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
          }`}
        >
          Contact Us
        </NavLink>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        <button 
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-md shadow-blue-900/20 cursor-pointer"
          onClick={() => navigate('/register')}
        >
          Get Started
        </button>
      </div>
    </nav>
  )
}

export default Header
