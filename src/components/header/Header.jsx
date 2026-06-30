import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../supabase/store/ThemeStore'

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="border-b border-app-border bg-app-nav-bg backdrop-blur-md sticky top-0 z-50 px-6 md:px-20 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between text-app-text-primary transition-colors">
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
          <span className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>

        {/* Burger Button (mobile only) */}
        <button 
          className="md:hidden text-app-text-secondary hover:text-app-text-primary transition-colors focus:outline-none cursor-pointer"
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
              isActive ? "text-app-accent font-bold" : "text-app-text-secondary hover:text-app-text-primary"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `text-sm font-semibold transition-all ${
              isActive ? "text-app-accent font-bold" : "text-app-text-secondary hover:text-app-text-primary"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `text-sm font-semibold transition-all ${
              isActive ? "text-app-accent font-bold" : "text-app-text-secondary hover:text-app-text-primary"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto border-t border-app-border md:border-t-0 pt-4 md:pt-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-app-text-secondary hover:text-app-text-primary rounded-lg transition-colors cursor-pointer w-full md:w-auto flex items-center justify-center gap-2"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
            <span className="md:hidden text-sm font-semibold">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          
          <button 
            className="text-xs font-semibold text-app-text-secondary hover:text-app-text-primary transition-colors px-3 py-2 cursor-pointer w-full md:w-auto text-center"
            onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
          >
            Login
          </button>
          <button 
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer w-full md:w-auto text-center"
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
