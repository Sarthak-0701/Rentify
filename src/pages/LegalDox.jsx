import React, { useEffect } from 'react';

const LegalLayout = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white tracking-tight border-b border-slate-900 pb-4">{title}</h1>
        <div className="text-sm leading-relaxed space-y-4 text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TermsAndServices = () => {
  return (
    <LegalLayout title="Terms of Service">
      <p>Welcome to Rentify. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.</p>
      <h2 className="text-lg font-semibold text-white pt-4">1. Use of Platform</h2>
      <p>Rentify provides tools for digital receipts, direct secure payments, and financial analytics. You agree to provide accurate and truthful information across the platform ecosystem.</p>
      <h2 className="text-lg font-semibold text-white pt-4">2. Limitation of Liability</h2>
      <p>Rentify is a utility provider and is not liable for structural disputes between landlords and tenants outside the processing mechanics of our software.</p>
    </LegalLayout>
  );
};

export const PrivacyPolicy = () => {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Your privacy is paramount at Rentify. This Policy details how we handle information processed through our rental infrastructure.</p>
      <h2 className="text-lg font-semibold text-white pt-4">1. Data Collection</h2>
      <p>We collect essential identifier details to secure payments and issue valid digital tax receipts as authorized by user roles.</p>
      <h2 className="text-lg font-semibold text-white pt-4">2. Bank-Grade Security</h2>
      <p>Payment information and data transmissions are encrypted. Financial analytics are processed dynamically and never sold to third parties.</p>
    </LegalLayout>
  );
};