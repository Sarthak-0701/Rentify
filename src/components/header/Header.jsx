import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-6 md:px-20 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
          <span className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>

        {/* Burger Button (mobile only) */}
        <button 
          className="md:hidden text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation links & Auth buttons */}
      <div className={`${
        isMobileMenuOpen ? 'flex' : 'hidden'
      } md:flex flex-col md:flex-row items-center gap-6 md:gap-8 mt-5 md:mt-0 w-full md:w-auto select-none transition-all duration-300`}>
        
        {/* Nav Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `text-sm font-semibold transition-all ${
              isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `text-sm font-semibold transition-all ${
              isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `text-sm font-semibold transition-all ${
              isActive ? "text-blue-400" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto border-t border-slate-900 md:border-t-0 pt-4 md:pt-0">
          <button 
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 cursor-pointer w-full md:w-auto text-center"
            onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
          >
            Login
          </button>
          <button 
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-md shadow-blue-900/20 cursor-pointer w-full md:w-auto text-center"
            onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header
