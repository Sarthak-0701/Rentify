import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Contact from '../pages/Contact'
import About from '../pages/About'

const Header = () => {
   
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  }
  const handleRegisterClick = () => {
    navigate('/register');
  }

  return (
    <>
      <nav className="border-b border-slate-850 bg-slate-950 backdrop-blur-md sticky top-0 z-50 px-25 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-3xl pl-3 cursor-pointer font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>

        <div className="flex gap-10 tracking-wide font-semibold">
            <NavLink to="/" element={<HomePage />}
            className={({isActive}) => `
            text-lg font-medium
            ${isActive ? "text-blue-500 scale-1.1" : "text-white"}
            hover:text-blue-400 hover:cursor-pointer
            `}
            >
              Home
            </NavLink>
            <NavLink to="/about" element={<About />}
            className={({isActive}) => `
            text-lg font-medium
            ${isActive ? "text-blue-500 scale-1.1" : "text-white"}
            hover:text-blue-400 hover:cursor-pointer
            `}
            >
              About
            </NavLink>
            <NavLink to="/contact" element={<Contact />}
            className={({isActive}) => `
            text-lg font-medium
            ${isActive ? "text-blue-500 scale-1.1" : "text-white"}
            hover:text-blue-400 hover:cursor-pointer
            `}
            >
              Contact Us
            </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button 
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2"
          onClick={() => {
            handleLoginClick();
          }}
          
          >
            Login
          </button>
          <button 
          className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/30 px-4 py-2 rounded-lg"
          onClick={() => {
            handleRegisterClick();
          }}
          
          >
            Get Started
          </button>
        </div>
      </nav>
    </>
  )
}

export default Header
