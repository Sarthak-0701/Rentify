import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import BasicLayout from './layouts/BasicLayout'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import TenantDashboard from './pages/tenant/TenantDashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuthStore } from './supabase/store/AuthStore'
import Properties from './pages/owner/Properties'
import Calculator from './pages/owner/Calculator'
import OwnerLayout from './layouts/OwnerLayout'
import TenantLayout from './layouts/TenantLayout'
import ReceiptHistory from './pages/owner/ReceiptHistory'
import TenantRentHistory from './pages/tenant/TenantRentHistory'
import PendingRequests from './pages/owner/PendingRequests';
import TenantRequests from './pages/tenant/TenantRequests';
import { PrivacyPolicy, TermsAndServices } from './pages/LegalDox'
import { useThemeStore } from './supabase/store/ThemeStore'
import NotFound from './pages/NotFound'

const MainApp = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    const cleanupAuth = initializeAuth();
    initTheme();

    return () => {
      if (typeof cleanupAuth === 'function') cleanupAuth();
    };
  }, [initializeAuth, initTheme]);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <BasicLayout />,
      children: [
        { path: '', element: <HomePage /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: 'terms' , element: <TermsAndServices />},
        { path: 'privacy' , element: <PrivacyPolicy/> },
        { path: '*', element: <NotFound /> }
      ]
    },
    { 
      path: '/login', 
      element: <Login /> 
    },
    { 
      path: '/register',
      element: <Register /> 
    },
    
    // NESTED STRUCTURE FOR OWNER DASHBOARD
    {
      element: <ProtectedRoute allowedRoles={['owner']} />,
      children: [
        {
          path: '/owner-dashboard',
          element: <OwnerLayout />,
          children: [
            { path: '', element: <OwnerDashboard /> },
            { path: 'properties', element: <Properties /> },
            { path: 'calculator', element: <Calculator /> },
            { path: 'pending-requests', element: <PendingRequests /> },
            { path: 'receipts/:propertyId/:roomId', element: <ReceiptHistory /> },
            { path: 'about' , element : <About />},
            { path: 'contact', element: <Contact />},
            { path: '*', element: <NotFound /> }
              ]
            }
          ]
        },

    // NESTED STRUCTURE FOR TENANT DASHBOARD
    {
      element: <ProtectedRoute allowedRoles={['tenant']} />,
      children: [
        {
          path: '/tenant-dashboard',
          element: <TenantLayout />, 
          children: [
            { path: '', element: <TenantDashboard /> },
            { path: 'requests', element: <TenantRequests /> },
            { path: 'rent-history', element: <TenantRentHistory /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
            { path: '*', element: <NotFound /> }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  return <RouterProvider router={router}/>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)