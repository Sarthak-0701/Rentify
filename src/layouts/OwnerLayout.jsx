import React from 'react'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import OwnerHeader from '../components/OwnerHeader'
import Leftsection from '../components/LeftSection/Leftsection'
import { useAuthStore } from '../supabase/store/AuthStore'

const OwnerLayout = () => {
  const profile = useAuthStore((state) => state.profile);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 antialiased selection:bg-blue-600/30 selection:text-white">
      <OwnerHeader />

      <div className="grow flex w-full items-start relative">
        
        <div className="absolute top-10 left-64 -z-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <Leftsection />
        
        <main className="grow px-10 py-6 bg-linear-to-br from-slate-950/40 via-gray-950 to-black flex flex-col space-y-3">
          <div className="w-full max-w-7xl mx-auto grow flex flex-col">
            <p className="text-gray-200 mb-4 text-lg font-bold capitalize">
              Welcome back, {profile?.full_name || 'Owner'}!
            </p>
            <Outlet /> 
          </div>
        </main>

      </div>
      
      <Footer />
    </div>
  )
}

export default OwnerLayout;