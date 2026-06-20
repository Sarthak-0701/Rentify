import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import BasicLayout from './Layouts/BasicLayout'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import OwnerDashboard from './pages/OwnerDashboard'
import TenantDashboard from './pages/TenantDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './supabase/store/AuthStore'
import Properties from './pages/OwnerPages/Properties'
import Calculator from './pages/OwnerPages/Calculator'
import OwnerLayout from './Layouts/OwnerLayout'
import TenantLayout from './Layouts/TenantLayout'

const MainApp = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <BasicLayout />,
      children: [
        { path: '', element: <HomePage /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> }
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
      element: <ProtectedRoute allowedRoles={['Owner']} />,
      children: [
        {
          path: '/owner-dashboard',
          element: <OwnerLayout />,
          children: [
            { path: '', element: <OwnerDashboard /> },
            { path: 'properties', element: <Properties /> },
            { path: 'calculator', element: <Calculator /> },
            { path: 'about' , element : <About />},
            { path: 'contact', element: <Contact />}
              ]
            }
          ]
        },

    // NESTED STRUCTURE FOR TENANT DASHBOARD
    {
      element: <ProtectedRoute allowedRoles={['Tenant']} />,
      children: [
        {
          element: <TenantLayout />, 
          children: [
            { path: '/tenant-dashboard', element: <TenantDashboard /> }
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router}/>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)