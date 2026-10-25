import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertOctagon } from 'lucide-react';
import { useAuthStore } from '../supabase/store/AuthStore';

const NotFound = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);

  const handleBackNavigation = () => {
    if (profile?.role === 'Owner') {
      navigate('/owner-dashboard');
    } else if (profile?.role === 'Tenant') {
      navigate('/tenant-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text-primary flex flex-col items-center justify-center p-6 scanlines transition-colors select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 z-10">
        
        {/* Animated Glitch Code Container */}
        <div className="glitch-wrapper relative select-none">
          <div className="glitch-text text-app-accent font-black tracking-tight" data-text="404">
            404
          </div>
        </div>

        {/* Error Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-danger-glow border border-app-danger-border text-app-danger text-[10px] font-bold uppercase tracking-wider">
            <AlertOctagon className="w-3.5 h-3.5" /> System Routing Failure
          </div>
          <h2 className="text-xl font-bold tracking-tight text-app-text-primary">Page Not Found</h2>
          <p className="text-xs text-app-text-muted leading-relaxed max-w-sm mx-auto">
            The resource coordinate you requested does not exist or has been relocated within the Rentify system.
          </p>
        </div>

        {/* Actions Button Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button 
            onClick={handleBackNavigation}
            className="w-full sm:w-auto px-5 py-2.5 bg-app-accent hover:bg-app-accent-hover text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 bg-app-card-to border border-app-card-border hover:bg-app-card-hover/20 text-app-text-primary text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-app-text-secondary" />
            Go to Home
          </button>
        </div>

      </div>

      {/* Terminal details footnote */}
      <div className="absolute bottom-6 text-[10px] text-app-text-muted font-mono tracking-widest text-center uppercase">
        Rentify v1.0.0 // Err_Route_Unresolved
      </div>
    </div>
  );
};

export default NotFound;
