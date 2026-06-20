import React from 'react'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import TenantHeader from '../components/TenantHeader'

const TenantLayout = () => {
  return (
    <>
      <TenantHeader />
      <Outlet />
      <Footer />
    </>
  )
}

export default TenantLayout
