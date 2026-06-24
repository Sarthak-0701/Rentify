# Rentify
This is a rental management module, digitizing receipt generation for property owners. Building a secure backend to facilitate owner-tenant interactions, enabling a dedicated portal for tenants to view and settle outstanding payments. Focused on UI/UX optimization to ensure a responsive and professional experience for diverse user roles.

Rentify – Property & Rental Management Platform
Rentify is a full-stack, responsive web application designed to simplify property management and rental tracking. It provides a seamless, real-time experience for both Property Owners and Tenants to manage properties, track collections, view statements, and handle monthly calculations efficiently.  Key FeaturesDual Role Ecosystem: Separate, secure dashboard portals engineered specifically for Property Owners and Tenants.  Property & Unit Management: Owners can register properties, add rooms/units, and track real-time occupancy logs.  Automated Rent Calculation: Features an interactive, built-in financial calculator to easily track maintenance budgeting, split utilities, and log calculation history.  Bill Tracking & Invoicing: Structured database logging for outstanding bills, dynamic rental history logs, and instant digital receipt/statement viewing.  Secure Session Persistence: Unified state management integrating secure user registration, multi-role authentication, and protected client-side routing.  
Tech Stack
Frontend: React, Vite, Tailwind CSS (for modern, highly responsive utility-first styling)  
Backend & Database: Supabase (PostgreSQL database, real-time backend services)  
Authentication: Supabase Auth (with protected client-side routing and custom role mapping) 
State Management: Built-in React Hooks & State Store Contexts  

Project Structuresrc/
├── components/
│   ├── auth/         # Protected routes and authorization filters
│   ├── dashboard/    # Shared layouts, global search, and calculators
│   ├── header/       # Distinct custom navbars for Owners and Tenants
│   ├── sidebar/      # Contextual side navigations per user role
│   └── tenant/       # Bills lists, active rentals, and detail modals
├── layouts/          # Dashboard wrapper layouts mapping UI configurations
├── pages/            # Core views (Login, Register, Owner views, Tenant views)
└── supabase/         # Configuration clients and unified database services  Setup & Installation InstructionsClone the Repository


git clone https://github.com/your-username/rentify.git
cd rentify  Install Project Dependencies
npm install  Configure Supabase Environment Variables

Create a .env file in the root directory and populate your credentials:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key  

Run the Local Development Server
npm run dev  

How to Use the Platform

A. As a Property Owner
Registration & Entry: Create a new account and explicitly choose the Owner role during registration.  
Property Setup: Navigate to the Properties tab via the sidebar. 
Click Add Property to add your building or estate details, and proceed to append individual rental units or rooms.  
Bill Generation & Tracking: View your overview dashboard to map specific tenants to rooms, log monthly collections, track incoming payments, and keep an organized archive of historical receipts.  
Calculations: Use the built-in Calculator page to compute maintenance budgets, utility breakdowns, or custom rent split matrices.  

B. As a Tenant
Registration & Entry: Create a new account and explicitly select the Tenant role.  
Linking Your Room: Navigate to the dashboard and use the Link Rental Room feature to link your profile directly to your landlord's registered unit using the designated property/room details.  
Tracking & Payments: Open your Outstanding Bills feed to view live updates on current rent sheets or statements issued by your landlord.  
View History: Click on individual entries to open detailed modal overviews, and inspect the complete Rent History log to track all previous distributions, balances, and digital receipts.  
Important Structural & Security Details
Role-Based Guards: Frontend routes are wrapped within a strict ProtectedRoute configuration. 
This programmatically prevents Tenants from accessing Owner pages (such as adding properties) and vice versa.  
Relational Database Schema: The architecture links tenants to explicit units inside properties via Supabase foreign key relationships, ensuring data consistency across payment records.  
Dynamic Content Re-rendering: The platform heavily uses responsive global hooks to immediately synchronize outstanding financial statements, collection ledgers, and property vacancy flags upon state mutations.
