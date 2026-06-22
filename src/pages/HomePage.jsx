import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import About from './About';
import Contact from './Contact';

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-slate-800 selection:text-white">

      <header className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center lg:pt-32">
        <div className="absolute inset-0 -z-10 mx-auto max-w-3xl h-75 bg-linear-to-r from-blue-900/20 to-slate-900/40 blur-[120px] rounded-full" />
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Property Management, <br />
          <span className="bg-linear-to-r from-blue-400 via-slate-400 to-gray-200 bg-clip-text text-transparent">
            Simplified for Everyone.
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate bridge between owners and tenants. Generate receipts, track analytics, and handle rent payments seamlessly in one dark, elegant space.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-900/40">
            Explore Owner Dashboard
          </button>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-gray-200 font-medium rounded-lg transition-all">
            Access Tenant Portal
          </button>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          

          <div className="bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-2xl p-8 hover:border-blue-900/50 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-900/50 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">For Property Owners</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Take full control of your real estate investments. Monitor earnings, evaluate occupancy, and stay on top of your financial metrics effortlessly.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Instant digital rent receipt generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Brief analysis & performance charts of properties
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Real-time status of pending and completed payments
              </li>
            </ul>
            <button className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-sm font-medium border border-slate-800 rounded-lg text-white transition-colors">
              Manage Your Properties
            </button>
          </div>


          <div className="bg-linear-to-b from-slate-950 to-black border border-slate-900 rounded-2xl p-8 hover:border-slate-800 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-gray-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">For Tenants</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Access your housing documents whenever you need them. Review breakdown structures and secure your rental tenure without back-and-forth messaging.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-slate-500">✓</span> Instant alerts when new receipts are generated
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">✓</span> Secure, integrated portal to pay directly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">✓</span> Complete downloadable historical receipt records
              </li>
            </ul>
            <button className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-sm font-medium border border-slate-800 rounded-lg text-white transition-colors">
              View Your Receipts
            </button>
          </div>

        </div>
      </main>

    </div>
  );
};

export default HomePage;