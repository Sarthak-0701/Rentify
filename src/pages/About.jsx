import React from 'react';

const About = () => {
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05,
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const elementsToReveal = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
    );
    elementsToReveal.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-app-bg text-app-text-primary font-sans selection:bg-app-accent-glow selection:text-app-accent rounded-lg transition-colors">
      {/* Hero Header */}
      <header className="reveal-up relative max-w-7xl mx-auto px-6 pt-20 pb-12 text-center lg:pt-28">
        <div className="absolute inset-0 -z-10 mx-auto max-w-2xl h-62.5 bg-blue-900/10 blur-[100px] rounded-full" />
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4">
          About Rentify
        </h1>
        <p className="text-app-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between modern real estate ownership and hassle-free renting through elegant digital workflows.
        </p>
      </header>

      {/* Main Core Philosophy */}
      <section className="reveal-scale max-w-4xl mx-auto px-6 py-8 text-center border-b border-app-border">
        <h2 className="text-xl font-semibold text-app-text-primary mb-4">Our Core Philosophy</h2>
        <p className="text-app-text-secondary text-sm sm:text-base leading-relaxed">
          Rentify was born out of a simple idea: property management shouldn't feel like a chore. 
          By creating an unified system where owners act as smooth operators and tenants experience seamless 
          financial transparency, we remove friction from the landlord-tenant relationship entirely.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="reveal-up text-2xl sm:text-3xl font-bold text-center text-app-text-primary mb-12">Core Features</h2>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => {
            const isLeft = idx % 2 === 0;
            const revealClass = isLeft ? "reveal-left" : "reveal-right";
            const delay = `${(idx + 1) * 150}ms`;
            
            return (
              <div 
                key={idx} 
                className={`${revealClass} bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border p-6 rounded-xl hover:border-app-card-hover hover:scale-103 cursor-pointer transition-all`}
                style={{ transitionDelay: delay }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-app-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-app-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;