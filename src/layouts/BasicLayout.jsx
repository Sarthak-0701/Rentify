import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const BasicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default BasicLayout
