import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../supabase/store/AuthStore';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../supabase/store/ThemeStore';

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);
  const { theme, toggleTheme } = useThemeStore();

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
    <div className="min-h-screen bg-app-bg text-app-text-primary font-sans flex flex-col selection:bg-app-accent-glow selection:text-app-accent transition-colors">
      
      <nav className="border-b border-app-border bg-app-nav-bg backdrop-blur-md sticky top-0 z-50 px-6 md:px-20 py-5 md:py-6 flex items-center justify-between precision-nav transition-colors">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Rentify.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-app-text-secondary hover:text-app-text-primary rounded-lg transition-colors cursor-pointer flex items-center justify-center mr-1"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
          </button>
          
          <span className="text-app-text-secondary hidden sm:inline">Don't have an account?</span>
          <button 
            disabled={loading}
            onClick={() => navigate('/register')}
            className="font-medium bg-app-card-to border border-app-card-border hover:bg-app-card-hover/20 text-app-text-primary transition-colors px-4 py-2 rounded-lg text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Centered Content */}
      <div className="grow flex flex-col justify-center items-center px-6 pb-12 relative">
        <div className="absolute inset-0 -z-10 mx-auto max-w-xl h-75 bg-blue-900/10 blur-[120px] rounded-full top-1/4" />

        <div className="max-w-md w-full bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-app-text-primary">Welcome back</h2>
            <p className="text-xs text-app-text-muted mt-1">Enter your details to access your dashboard</p>
          </div>

          {/* Feedback Validation Message */}
          {(localError || storeError) && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 text-center">
              {localError || storeError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-3 text-sm text-app-text-primary placeholder-gray-400 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary">Password</label>
                <a href="#" className="text-xs text-app-accent hover:text-app-accent-hover transition-colors">Forgot password?</a>
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
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg pl-4 pr-12 py-3 text-sm text-app-text-primary placeholder-gray-400 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-app-text-secondary hover:text-app-text-primary cursor-pointer focus:outline-none"
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
              className="w-full py-3 mt-2 bg-app-accent hover:bg-app-accent-hover text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
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