import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../supabase/store/AuthStore';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError(null);
  
  if (!formData.email || !formData.password) {
    setLocalError("Please fill out all fields.");
    return;
  }

  try {
    await loginUser(formData.email, formData.password);
    
    const userProfile = useAuthStore.getState().profile;
    
    if (userProfile?.role === 'Owner') {
      navigate('/owner-dashboard');
    } else if (userProfile?.role === 'Tenant') {
      navigate('/tenant-dashboard');
    } else {
      navigate('/');
    }
  } catch (err) {
    setLocalError(err.message || 'Invalid login credentials.');
  }
};

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col selection:bg-slate-800 selection:text-white">
      
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 px-20 py-6 flex items-center justify-between precision-nav">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-gray-500 hidden sm:inline">Don't have an account?</span>
          <button 
            disabled={loading}
            onClick={() => navigate('/register')}
            className="font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition-colors px-4 py-2 rounded-lg text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Centered Content */}
      <div className="grow flex flex-col justify-center items-center px-6 pb-12 relative">
        <div className="absolute inset-0 -z-10 mx-auto max-w-xl h-75 bg-blue-900/10 blur-[120px] rounded-full top-1/4" />

        <div className="max-w-md w-full bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your details to access your dashboard</p>
          </div>

          {/* Feedback Validation Message */}
          {(localError || storeError) && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 text-center">
              {localError || storeError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                <a href="#" className="text-xs text-blue-400/80 hover:text-blue-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500 rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white hover:text-slate-200 cursor-pointer focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;