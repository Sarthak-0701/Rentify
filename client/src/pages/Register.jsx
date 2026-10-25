import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../supabase/store/AuthStore';
import { Eye, EyeOff, Sun, Moon, ChevronDown } from 'lucide-react';
import { useThemeStore } from '../supabase/store/ThemeStore';

const Register = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);
  const { theme, toggleTheme } = useThemeStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Tenant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await registerUser(formData.email, formData.password, formData.name, formData.role);

      if (formData.role === 'Owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text-primary font-sans flex flex-col selection:bg-app-accent-glow selection:text-app-accent transition-colors">
      {/* Top Navbar */}
      <nav className="border-b border-app-border bg-app-nav-bg backdrop-blur-md sticky top-0 z-50 px-6 md:px-20 py-5 md:py-6 flex items-center justify-between transition-colors">
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
          
          <span className="text-app-text-secondary hidden sm:inline">Already have an account?</span>
          <button 
            disabled={loading}
            onClick={() => navigate('/login')}
            className="font-medium bg-app-card-to border border-app-card-border hover:bg-app-card-hover/20 text-app-text-primary transition-colors px-4 py-2 rounded-lg text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="grow flex flex-col justify-center items-center px-6 pb-12 relative">
        <div className="absolute inset-0 -z-10 mx-auto max-w-xl h-75 bg-blue-900/10 blur-[120px] rounded-full top-1/4" />

        <div className="max-w-md w-full bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-app-text-primary">Get started today</h2>
            <p className="text-xs text-app-text-muted mt-1">Manage, verify, and complete rental setups instantly</p>
          </div>

          {/* Error Banner */}
          {(localError || storeError) && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 text-center">
              {localError || storeError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Mercer"
                className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-gray-400 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-gray-400 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg pl-4 pr-12 py-2.5 text-sm text-app-text-primary placeholder-gray-400 outline-none transition-colors disabled:opacity-50"
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Join Account As</label>
              <div className="relative">
                {dropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary flex items-center justify-between cursor-pointer disabled:opacity-50 relative z-50 text-left outline-none transition-colors"
                >
                  <span>
                    {formData.role === 'Owner' 
                      ? 'Owner (Manage Properties & Issue Receipts)' 
                      : 'Tenant (View Receipts & Pay Rent)'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-app-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-app-card-from border border-app-card-border rounded-xl shadow-2xl overflow-hidden py-1 transition-all">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, role: 'Owner' });
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer flex flex-col ${
                        formData.role === 'Owner'
                          ? 'bg-app-accent-glow text-app-accent font-semibold border-l-2 border-app-accent'
                          : 'text-app-text-secondary hover:bg-app-card-hover/20 hover:text-app-text-primary'
                      }`}
                    >
                      <span className="text-sm font-semibold">Property Owner</span>
                      <span className="text-[10px] opacity-80 mt-0.5">Manage Properties & Issue Receipts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, role: 'Tenant' });
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer flex flex-col ${
                        formData.role === 'Tenant'
                          ? 'bg-app-tenant-accent-glow text-app-tenant-accent font-semibold border-l-2 border-app-tenant-accent'
                          : 'text-app-text-secondary hover:bg-app-card-hover/20 hover:text-app-text-primary'
                      }`}
                    >
                      <span className="text-sm font-semibold">Tenant</span>
                      <span className="text-[10px] opacity-80 mt-0.5">View Receipts & Pay Rent</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-app-accent hover:bg-app-accent-hover text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;