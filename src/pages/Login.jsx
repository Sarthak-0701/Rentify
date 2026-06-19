import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col selection:bg-slate-800 selection:text-white">
      
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 px-20 py-6 flex items-center justify-between precision-nav">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-gray-500 hidden sm:inline">Don't have an account?</span>
          <button 
            onClick={() => navigate('/register')}
            className="font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition-colors px-4 py-2 rounded-lg text-xs sm:text-sm"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Container - Centered Content */}
      <div className="grow flex flex-col justify-center items-center px-6 pb-12 relative">
        {/* Background radial glow */}
        <div className="absolute inset-0 -z-10 mx-auto max-w-xl h-75 bg-blue-900/10 blur-[120px] rounded-full top-1/4" />

        <div className="max-w-md w-full bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your details to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-400/80 hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-blue-900/30"
            >
              Sign In
            </button>
          </form>

          {/* Alternative Bottom Redirect for Mobile layout optimization */}
          <p className="text-center text-xs text-gray-500 mt-6 sm:hidden">
            Don't have an account?{' '}
            <Link to={'/register'} className="text-blue-400 hover:underline cursor-pointer">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;