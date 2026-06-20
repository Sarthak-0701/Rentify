import React from 'react';

const About = () => {
  const features = [
    {
      title: "Financial Management & Analytics",
      description: "Owners get an intuitive dashboard featuring an analysis of their properties, tracking passive earnings, occupancy trends, and payment overviews.",
      icon: "📊"
    },
    {
      title: "Easy Download of Receipts",
      description: "Both tenants and owners can instantly download sleek, legally compliant PDF rent receipts with a single click, keeping paperwork organized.",
      icon: "📥"
    },
    {
      title: "Direct Integrated Payments",
      description: "Tenants can view active receipts and securely pay rent directly inside the portal, eliminating manual wire transfers and tracking stress.",
      icon: "💳"
    },
    {
      title: "Real-time Transparency",
      description: "No more endless text messages. As soon as an owner updates a dashboard metric or creates a receipt, the tenant is notified instantly.",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-slate-800 selection:text-white rounded-lg">
      {/* Hero Header */}
      <header className="relative max-w-7xl mx-auto px-6 pt-20 pb-12 text-center lg:pt-28">
        <div className="absolute inset-0 -z-10 mx-auto max-w-2xl h-62.5 bg-blue-900/10 blur-[100px] rounded-full" />
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 via-slate-200 to-gray-400 bg-clip-text text-transparent mb-4">
          About Rentify
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between modern real estate ownership and hassle-free renting through elegant digital workflows.
        </p>
      </header>

      {/* Main Core Mission */}
      <section className="max-w-4xl mx-auto px-6 py-8 text-center border-b border-slate-900">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Our Core Philosophy</h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Rentify was born out of a simple idea: property management shouldn't feel like a chore. 
          By creating an unified system where owners act as smooth operators and tenants experience seamless 
          financial transparency, we remove friction from the landlord-tenant relationship entirely.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">Core Features</h2>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-linear-to-b from-slate-950 to-black border border-slate-900 p-6 rounded-xl hover:border-slate-600 hover:scale-103 cursor-pointer transition-all">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;