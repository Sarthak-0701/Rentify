import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import OwnerHeader from '../components/OwnerHeader'

const DashboardLayout = () => {
  return (
    <>
      <OwnerHeader />
      <Outlet />
      <Footer />
    </>
  )
}

export default DashboardLayout
